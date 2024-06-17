import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload, message, InputNumber } from 'antd';
import '../../styles/style.css'
import React, { useEffect, useState } from "react";
import { changeInvoiceStatus, downloadInvoice, fetchPoNumbers, fetchPoNumbr, getInvoiceData, removeInvoiceFile, updateInvoice, threshold } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Roles from "@/components/Roles";
import { saveAs } from "file-saver";
import useInvoice from "@/hooks/useInvoice";
import ChangeStatus from "@/components/PoChangeStatus";
import { event } from "react-ga";
import { useGlobalContext } from "@/app/Context/UserContext";

const { TextArea } = Input;
const { Option } = Select;

const repeatorData = {
    invoice_file: ''
}

const EditInvoice = (view) => {
    const [poNumber, setPoNumber] = useState([]);
    const [invoice, setInvoice] = useState({});
    const [responseData, setResponseData] = useState([]);
    const [po, setPo] = useState('');
    const [refetch, setRefetch] = useState(true);
    const { approval_enabled } = useInvoice(invoice);
    const [isModalOpen, setIsModalOpen] = useState({
        modalStatus: false,
        action: ''
    });
    const router = useRouter();
    const { id } = router.query;
    const [form] = Form.useForm();
    const [thres, setThreshold] = useState()
    const [show, setshow] = useState(true)
    const { user } = useGlobalContext();

    const onFinish = () => {
        const formData = new FormData();

        formData.append('po_id', invoice.purchase_order?.po_id);
        formData.append('comment', invoice.comment);
        formData.append('invoice_amount', invoice.invoice_amount);
        formData.append('invoice_id', invoice.invoice_id);
        invoice.invoice_files?.forEach((file, index) => {
            if (typeof file.invoice_file === 'string') return;
            formData.append(`invoice_file_${index}`, file.invoice_file);
        });

        updateInvoice(formData).then((res) => {
            if (res?.data?.status) {
                message.success('Invoice Updated!');
                router.push('/invoice');
            }
        }).catch((error) => {
            message.error(error.response.data.message)
        })
    };

    useEffect(() => {
        if (id && refetch) {
            const response = fetchPoNumbr()
            response.then((res) => {
                if (res?.data?.status) {
                    setPoNumber([...res.data.data]);
                }
            });
            const invoicePromise = getInvoiceData(id);

            invoicePromise.then((res) => {
                if (res?.data?.status) {
                    const data = res.data.data;
                    let updatedInvoice = { ...data, po_creator: res.data?.po_creator }
                    if (updatedInvoice.invoice_files.length === 0) {
                        updatedInvoice.invoice_files = [{ ...repeatorData }]
                    }
                    setInvoice({ ...updatedInvoice });
                    form.setFieldValue('invoice_amount', data.invoice_amount.toLocaleString());
                    form.setFieldValue('note', data.comment);
                    form.setFieldValue('po_type', res.data?.data?.purchase_order?.po_type);
                    form.setFieldValue('po_number', res.data?.data?.purchase_order?.po_number);
                    setPo(res.data?.data?.purchase_order?.po_type)
                    fetchPoNumber(res.data?.data?.purchase_order?.po_id);
                }
            })
            setRefetch(false);
        }
    }, [id, refetch]);

    useEffect(() => {
        if (po) {
            const response = fetchPoNumbr(po)
            response.then((res) => {
                if (res?.data?.status) {
                    setPoNumber([...res.data.data]);
                }
            })
        }
    }, [po])

    const fetchPoNumber = (id) => {
        const response = fetchPoNumbers(id)
        response.then((res) => {
            const data = res.data.data;
            setResponseData(data);
            form.setFieldValue('po_id', id)
        })
    }

    const beforeUpload = (file, index) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('Only PDF files are allowed!');
            form.setFieldValue('invoice_file' + index, [])
        }
        return isPDF;
    };

    const onChange = (name, value, index) => {
        if (typeof index !== 'undefined') {
            invoice.invoice_files[index][name] = value;
        } else {
            invoice[name] = value;
        }
        setInvoice({
            ...invoice
        });
    }

    const handleStatusChange = (event, action, form) => {
        event.preventDefault()
        const response = changeInvoiceStatus({
            invoice_id: id,
            status: action,
            approval_notes: form?.approval_notes
        });
        response.then((res) => {
            if (res?.data?.status) {
                message.success(res.data?.message);
                setIsModalOpen(false);
                setRefetch(true);
            }
        })
    }

    const openInvoiceInNewTab = (id) => {
        downloadInvoice(id).then((res) => {
            if (res?.data) {
                const fileBlob = new Blob([res.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(fileBlob);
                window.open(fileURL, '_blank');
            }
        })
    }
   

    const handleDownload = (id) => {
        downloadInvoice(id).then((res) => {
            if (res?.data) {
                const fileName = `invoice_${id}.pdf`;
                saveAs(res.data, fileName);
            }
        })
    }

    return (
        <>
            <div class="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Invoice' />
                    <div class="bottom-wrapp-purchase">
                        <div class="wrapp-in-voice">
                            <ul class="bg-colored-ul mb-4 d-block">
                                <li class="bg-li-invoice justify-content-between d-flex align-items-center">
                                    <div className="plus-wraptext d-flex align-items-center">
                                        <PlusOutlined className="me-3" />
                                        <span>Edit Invoice</span>
                                    </div>
                                    {
                                        approval_enabled &&
                                        <Roles action="approve_invoice">
                                            <div className="mt-0 apr-rej-li d-flex">
                                                <Button type="primary" className="approved-btn me-3" onClick={(event) => {
                                                    setIsModalOpen({
                                                        modalStatus: true,
                                                        action: 'approved'
                                                    })
                                                }}>Approve</Button>
                                                <Button type="primary" danger className="reject-btn" onClick={(event) => {
                                                    setIsModalOpen({
                                                        modalStatus: true,
                                                        action: 'rejected'
                                                    })
                                                }}>Reject</Button>
                                            </div>
                                        </Roles>
                                    }
                                </li>
                                {/* {
                                    approval_enabled && approvalStatus === '' && // Only show when approval not yet given
                                    <Roles action="approve_invoice">
                                        <li>
                                            <Button type="primary" onClick={(event) => {
                                                handleStatusChange(event, 'approved')
                                            }}>Approve</Button>
                                            <Button type="primary" danger onClick={(event) => {
                                                handleStatusChange(event, 'rejected')
                                            }}>Reject</Button>
                                        </li>
                                    </Roles>
                                } */}
                                {/* {
                                    approval_enabled &&
                                    <Roles action="approve_invoice">
                                        <li>
                                            <Button type="primary" onClick={(event) => {
                                                // handleStatusChange(event, 'approved')
                                                setIsModalOpen(true)
                                            }}>Approve</Button>
                                            <Button type="primary" danger onClick={(event) => {
                                                handleStatusChange(event, 'rejected')
                                            }}>Reject</Button>
                                        </li>
                                    </Roles>
                                }
                                 */}
                            </ul>
                            {
                                responseData.po_type == 'material' && (
                                    <>
                                        <Material_invoice data={responseData} />
                                    </>
                                )
                            }
                            {
                                responseData.po_type == 'rental' && (
                                    <>
                                        <Rental_invoice data={responseData} />
                                    </>
                                )
                            }
                            {
                                responseData.po_type == 'subcontractor' && (
                                    <>
                                        <Subcontractor_invoice data={responseData} />
                                    </>
                                )
                            }
                            <div className="choose-file">
                                <Form
                                    name="antdForm"
                                    className="mt-5"
                                    onFinish={onFinish}
                                    form={form}
                                >
                                    <div className="row mb-4">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap react-select">
                                                <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                                    <Form.Item
                                                        label="Choose PO Type"
                                                        name="po_type"
                                                        class="bold-label"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose PO Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select disabled placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                        >
                                                            <Option value="material">Material PO</Option>
                                                            <Option value="rental">Rental PO</Option>
                                                            <Option value="subcontractor">Sub Contractor PO</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="linewrap d-flex"><span class="d-block me-2">Edit Invoice</span><hr/></div>

                                        <div className="col-lg-4 col-md-6">
                                            {/* <div className="selectwrap  shipment-caret aligned-text"> */}
                                            <div class={`selectwrap ${view || edit && invoice.status !== 'pending' ? 'non-editable-dropdown' : ''} shipment-caret  invoice-select  aligned-text`}>

                                                <Form.Item
                                                    label="Choose PO Number"
                                                    name="po_number"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose PO Number",
                                                        },
                                                    ]}
                                                >
                                                    <Select disabled placeholder="Select PO Number" id="create-invoice"
                                                        class="js-states form-control file-wrap-select bold-select"
                                                    >
                                                        {poNumber.map((entry) => (
                                                            <Select.Option key={entry.po_id} value={entry.po_id}>
                                                                {entry.po_number}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        invoice.invoice_files?.map((data, index) => {
                                            let fileName;
                                            if (typeof data.invoice_file !== 'object' && typeof data.invoice_file !== 'undefined') {
                                                const invoice_file_split = data.invoice_file?.split('/')
                                                fileName = invoice_file_split[invoice_file_split?.length - 1];
                                            }
                                            return (
                                                <>
                                                    <div className="download-wrap d-flex gap-2 mb-4">
                                                        {
                                                            fileName ? <>
                                                                    <div className="download-fine-invoice" onClick={() => openInvoiceInNewTab(data.file_id)} style={{cursor:'pointer'}}>
                                                                        {fileName} <DownloadOutlined onClick={(e) => { e.stopPropagation(); handleDownload(data.file_id); }}  />
                                                                    </div>
                                                                {/* <div className="download-fine-invoice">
                                                                    {fileName} <DownloadOutlined onClick={() => handleDownload(data.file_id)} />
                                                                </div> */}
                                                            </>
                                                                :
                                                                <Form.Item
                                                                    name={`invoice_file` + index}
                                                                    className="select-file-invoice"
                                                                    valuePropName="fileList"
                                                                    rules={[{
                                                                        required: ((!invoice?.invoice_files[index]?.invoice_file) || (invoice.invoice_files.some((file) => typeof file.invoice_file === 'object' && file.invoice_file?.type !== 'application/pdf'))),
                                                                        message: 'Please select a file'
                                                                    }]}
                                                                    getValueFromEvent={(e) => {
                                                                        onChange('invoice_file', e.fileList[0]?.originFileObj, index)
                                                                    }}
                                                                >
                                                                    <Upload beforeUpload={(files) => beforeUpload(files, index)} accept=".pdf" maxCount={1} className="upload-filewrap" >
                                                                        <Button icon={<UploadOutlined />} className="file-btn" >Select File</Button>
                                                                    </Upload>
                                                                </Form.Item>
                                                        }
                                                        {
                                                            (index > 0 || fileName) && <MinusOutlined className="minus-wrap kt" onClick={() => {
                                                                if (data.file_id) {
                                                                    removeInvoiceFile({ file_id: data.file_id }).then((res) => {
                                                                        if (res?.data?.status) {

                                                                            message.success('File removed successfully');
                                                                            setRefetch(true);
                                                                        }
                                                                    })
                                                                } else {

                                                                    setInvoice({
                                                                        ...invoice,
                                                                        invoice_files: [...invoice.invoice_files.slice(0, index), ...invoice.invoice_files.slice(index + 1)]
                                                                    });
                                                                }


                                                            }} style={{ marginLeft: '8px' }} />
                                                        }
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item name='invoice_files'>
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setInvoice({
                                                ...invoice,
                                                invoice_files: [...invoice.invoice_files, { ...repeatorData }]
                                            });
                                        }} icon={<PlusOutlined />}>
                                            Add Invoice
                                        </Button>
                                    </Form.Item>
                                    <Form.Item name={"note"} className="note-wrap wrap-box">
                                        <TextArea onChange={({ target: { value } }) => onChange('comment', value)} />
                                    </Form.Item>
                                    <Form.Item
                                        name={"invoice_amount"}
                                        className="note-wrap wrap-box dollor-inputs no-number-rental"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter amount",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            addonBefore='$'
                                            formatter={value => `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')}
                                            parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}
                                            onChange={(value) => {
                                                onChange('invoice_amount', value)
                                            }}
                                            placeholder={`Please enter amount`}
                                            disabled={!(user.role === 'admin' || user.role === 'accounting')}
                                        />
                                    </Form.Item>
                                    {invoice.invoice_amount && invoice.invoice_amount !== 0 ? (
                                        <span className="error-msg" style={{ color: 'red', display: /^-?\d*\.?\d+$/.test(invoice.invoice_amount) && (parseFloat(responseData?.total_amount || 0) >= parseFloat(invoice?.invoice_amount || 0)) ? 'none' : 'block' }}>
                                            {/* {invoice.invoice_amount && !/^-?\d*\.?\d+$/.test(invoice.invoice_amount) ? 'Please Enter Positive Numbers only' : ''} */}
                                            {invoice.invoice_amount && !/^-?\d*\.?\d+$/.test(invoice.invoice_amount) ? 'Please Enter Positive Numbers only' : 'Invoice amount cannot be greater than PO amount'}
                                        </span>
                                    ) : ''}

                                    <Form.Item>
                                        <Button
                                            // disabled={!(parseFloat(responseData?.total_amount || 0)) || (invoice?.invoice_amount && !/^-?\d*\.?\d+$/.test(invoice?.invoice_amount))} type="primary" htmlType="submit" id="btn-submit"
                                        disabled={!(parseFloat(responseData?.total_amount || 0) >= parseFloat(invoice?.invoice_amount || 0)) || (invoice?.invoice_amount && !/^-?\d*\.?\d+$/.test(invoice?.invoice_amount))} type="primary" htmlType="submit" id="btn-submit"
                                        >
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen?.modalStatus && <ChangeStatus po_id={id} handleStatusChange={handleStatusChange} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </>
    )
}
export default EditInvoice;