import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload, message } from 'antd';
import '../../styles/style.css'
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr, getInvoiceData, removeInvoiceFile, updateInvoice } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Roles from "@/components/Roles";

const { TextArea } = Input;

const repeatorData = {
    invoice_file: ''
}

const EditInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [invoice, setInvoice] = useState({});
    const [responseData, setResponseData] = useState([]);
    const [refetch, setRefetch] = useState(true);
    const router = useRouter();
    const { id } = router.query;
    const [form] = Form.useForm();

    const onFinish = () => {
        const formData = new FormData();

        formData.append('po_id', invoice.purchase_order?.po_id);
        formData.append('comment', invoice.comment);
        formData.append('invoice_amount', invoice.invoice_amount);
        form.invoice_files?.forEach((file, index) => {
            if(typeof file.invoice_file === 'string') return;
            formData.append(`invoice_file_${index}`, file.invoice_file);
        });

        updateInvoice(formData).then((res) => {
            if(res?.data?.status) {
                message.success('Invoice Updated!');
                router.push('/invoice');
            }
        })
    };

    useEffect(() => {
        if(id && refetch) {
            const response = fetchPoNumbr()
            response.then((res) => {
                if (res?.data?.status) {
                    setPoNumber([...res.data.data]);
                }
            });
            const invoicePromise = getInvoiceData(id);

            invoicePromise.then((res) => {
                if(res?.data?.status) {
                    const data = res.data.data;
                    setInvoice({...data, can_change_status: res.data?.can_change_status});
                    form.setFieldValue('amount', data.invoice_amount);
                    form.setFieldValue('note', data.comment);
                    fetchPoNumber(res.data?.data?.purchase_order?.po_id);
                }
            })
        }
    }, [id, refetch]);

    const fetchPoNumber = (id) => {
        const response = fetchPoNumbers(id)
        response.then((res) => {
            const data = res.data.data;
            setResponseData(data);
            form.setFieldValue('po_id', id)
        })
    }

    const beforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('Only PDF files are allowed!');
        }
        return isPDF;
    };

    const onChange = (name, value, index) => {
        if(typeof index !== 'undefined') {
            invoice.invoice_files[index][name] = value;
        } else {
            invoice[name] = value;
        }
        setInvoice({
            ...invoice
        });
    }

    const handleStatusChange = (event, action) => {
        event.preventDefault()
        const response = updateInvoice({
            invoice_id: id,
            status: action
        });
        response.then((res) => {
            if(res?.data?.status) {
                setRefetch(true);
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
                            <ul class="bg-colored-ul mb-4">
                                <li class="bg-li-invoice">
                                    <PlusOutlined className="me-3" />
                                    <span>Edit Invoice</span>
                                </li>
                                {
                                invoice.status === 'pending' && invoice.status && <Roles action="approve_invoice">
                                <li>
                                    <Button type="primary" onClick={(event) => {
                                        handleStatusChange(event, 'approve')
                                    }}>Approve</Button>
                                    <Button type="primary" danger onClick={(event) => {
                                        handleStatusChange(event, 'reject')
                                    }}>Reject</Button>
                                </li>
                            </Roles>
                            }
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
                                            <div className="selectwrap  shipment-caret invoice-select aligned-text">
                                                <Form.Item name={"note"}>
                                                    <Select name="po_id" disabled placeholder="Select PO Type" id="create-invoice"
                                                        class="js-states form-control file-wrap-select bold-select"
                                                        onChange={(value) => fetchPoNumber(value)}
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
                                            if(typeof data.invoice_file !== 'object') {
                                                const invoice_file_split = data.invoice_file?.split('/')
                                                fileName = invoice_file_split[invoice_file_split.length - 1];
                                            }
                                            return (
                                                <>
                                                    {
                                                        fileName ? <>
                                                            <div>
                                                                {fileName} <DownloadOutlined onClick={() => handleDownload(index)} />
                                                            </div>
                                                        </> : 
                                                        <Form.Item
                                                            name={`invoice_file` + index}
                                                            className="select-file-invoice"
                                                            valuePropName="fileList"
                                                            getValueFromEvent={(e) => onChange('invoice_file', e.fileList[0].originFileObj, index)}
                                                        >
                                                            <Upload beforeUpload={beforeUpload} accept=".pdf" maxCount={1}>
                                                                <Button icon={<UploadOutlined />} className="file-btn" >Select File</Button>
                                                            </Upload>
                                                        </Form.Item>
                                                    }
                                                    {
                                                        <MinusOutlined className="minus-wrap" onClick={() => {
                                                            removeInvoiceFile(index).then((res) => {
                                                                if(res?.data?.status) {
                                                                    setInvoice({
                                                                        ...invoice,
                                                                        invoice_files: [...invoice.invoice_files.slice(0, index), ...invoice.invoice_files.slice(index + 1)]
                                                                    });
                                                                }
                                                            })
                                                        }} style={{ marginLeft: '8px' }} />
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item>
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setInvoice({
                                                ...invoice,
                                                invoice_files: [...invoice.invoice_files, {...repeatorData}]
                                            });
                                        }} icon={<PlusOutlined />}>
                                            Add Invoice
                                        </Button>
                                    </Form.Item>
                                    <Form.Item name={"note"} className="note-wrap wrap-box">
                                        <TextArea onChange={({target: { value }}) => onChange('comment', value)} />
                                    </Form.Item>
                                    <Form.Item name={"amount"} className="note-wrap wrap-box">
                                        <Input onChange={({target: { value }}) => onChange('invoice_amount', value)} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" id="btn-submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EditInvoice;