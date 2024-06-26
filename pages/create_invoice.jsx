import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload, message, InputNumber } from 'antd';
import '../styles/style.css'
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr, invoiceSubmit } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import SearchDropdown from "@/components/SearchDropdown";
import { filterInvoicePO, getInvoivePOMenuItem } from "@/utility/filters";

const { TextArea } = Input;
const { Option } = Select;

const repeatorData = {
    invoice_file: ''
}

const CreateInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [po, setPo] = useState('');
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        comment: '',
        po_id: '',
        invoice_amount: '',
        invoice_files: [repeatorData]
    });

    const router = useRouter();

    const onFinish = () => {
        // try {
        const data = new FormData();
        data.append('comment', formData.comment);
        data.append('invoice_amount', formData.invoice_amount);
        data.append('po_id', formData.po_id);
        formData.invoice_files?.forEach((file, index) => {
            data.append(`invoice_file_${index}`, file.invoice_file);
        })

        const response = invoiceSubmit(data)
        response.then((res) => {
            if (res.data.status_code == 201) {
                message.success(res.data.message);
                router.push('/invoice');
            }
        }).catch((error) => {
            message.error(error.response.data.message)
        })
    };

    useEffect(() => {
        const response = fetchPoNumbr()
        response.then((res) => {
            if (res?.data?.status) {
                setPoNumber([...res.data.data]);
            }
        })
    }, [])

    const fetchPoNumber = (id) => {
        const response = fetchPoNumbers(id)
        response.then((res) => {
            const data = res.data.data;
            setFormData({
                ...formData,
                po_id: data.po_id,
            })
            setResponseData(data)
        })

    }

    const handlePoTypeChange = (value) => {
        form.setFieldValue('po_number', '');
        setResponseData([]);
        setPo(value);
        setPoNumber([]);
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
            formData.invoice_files[index][name] = value;
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
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
                                    <span>Create Invoice </span>
                                </li>

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
                                    // className="mt-5"
                                    form={form}
                                    onFinish={onFinish}
                                >
                                    <div className="row mb-4">
                                        {/* <div className="col-lg-4 col-md-6">
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
                                                        <Select placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                            onChange={(value) => handlePoTypeChange(value)}
                                                        >
                                                            <Option value="material">Material PO</Option>
                                                            <Option value="rental">Rental PO</Option>
                                                            <Option value="subcontractor">Sub Contractor PO</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div> */}
                                        {/* <div className="heading mb-3">
                                            <p>Create Invoice</p>
                                        </div> */}
                                        <div class="linewrap d-flex"><span class="d-block me-2">Create Invoice</span><hr/></div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap  shipment-caret invoice-select aligned-text">
                                                <div className="ns-field-set ">
                                                    <SearchDropdown
                                                        name="po_number"
                                                        label="Choose PO Number"
                                                        required={true}
                                                        form={form}
                                                        filterFunc={filterInvoicePO}
                                                        callback={(value) => {
                                                            fetchPoNumber(value)
                                                        }}
                                                        data={poNumber}
                                                        getMenuItems={getInvoivePOMenuItem}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        formData.invoice_files?.map((data, index) => {
                                            return (
                                                <>
                                                    <div className="both-wrapinone d-flex align-items-center mb-3">
                                                        <Form.Item
                                                            name={`invoice_file` + index}
                                                            className="select-file-invoice mb-custom"
                                                            valuePropName="fileList"
                                                            rules={[{ required: (formData?.invoice_files[index]?.invoice_file === '' || formData.invoice_files.some(file => file.invoice_file?.type !== 'application/pdf')), message: 'Please select a file' }]}
                                                            getValueFromEvent={(e) => {
                                                                onChange('invoice_file', e.fileList[0]?.originFileObj, index)
                                                            }}
                                                        >
                                                            <Upload beforeUpload={(files) => beforeUpload(files, index)} accept=".pdf" maxCount={1} className="upload-filewrap" >
                                                                <Button icon={<UploadOutlined />} className="file-btn" >Select File<span className="star">*</span></Button>
                                                            </Upload>
                                                        </Form.Item>
                                                        {
                                                            index > 0 && <MinusOutlined className="minus-wrap" onClick={() => {
                                                                setFormData({
                                                                    ...formData,
                                                                    invoice_files: [...formData.invoice_files.slice(0, index), ...formData.invoice_files.slice(index + 1)]
                                                                });
                                                            }} style={{ marginLeft: '8px' }} />
                                                        }
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item
                                        name='invoice_files'
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: "Please select file",
                                    //     },
                                    // ]}
                                    >
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setFormData({
                                                ...formData,
                                                invoice_files: [...formData.invoice_files, { ...repeatorData }]
                                            });
                                        }} icon={<PlusOutlined />}>
                                            Add File
                                        </Button>
                                    </Form.Item>
                                    <Form.Item name="note" className="note-wrap wrap-box">
                                        <TextArea
                                            onChange={({ target: { value } }) => onChange('comment', value)}
                                            rows={8}
                                            placeholder={`Please enter a note`} />
                                    </Form.Item>

                                    <Form.Item name={"amount"} className="note-wrap wrap-box dollor-inputs no-number-rental"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter amount",
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            addonBefore="$"
                                            formatter={value => `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')}
                                            parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}
                                            onChange={(value) => {
                                                onChange('invoice_amount', value)
                                            }}
                                            placeholder={`Please enter amount`} />
                                    </Form.Item>
                                    {formData.invoice_amount && formData.invoice_amount !== 0 ? (
                                        <span className="error-msg" style={{
                                            color: 'red',
                                            display: /^-?\d*\.?\d+$/.test(formData.invoice_amount)
                                                // display: /^[0-9]*$/.test(formData.invoice_amount) 
                                                && (parseFloat(responseData?.total_amount || 0) >= parseFloat(formData?.invoice_amount || 0)) ? 'none' : 'block'
                                        }}>
                                              {/* {formData.invoice_amount && !/^-?\d*\.?\d+$/.test(formData.invoice_amount) ? 'Please Enter Positive Numbers only' : ''} */}
                                            {formData.invoice_amount && !/^-?\d*\.?\d+$/.test(formData.invoice_amount) ? 'Please Enter Positive Numbers only' : 'Invoice amount cannot be greater than PO amount'}
                                        </span>
                                    ) : ''}

                                    <Form.Item>
                                        <Button
                                        //  disabled={!(parseFloat(responseData?.total_amount || 0)) || (formData.invoice_files.some(file => file.invoice_file?.type !== 'application/pdf' || !file.invoice_file)) || (formData?.invoice_amount && !/^-?\d*\.?\d+$/.test(formData?.invoice_amount))}
                                            disabled={!(parseFloat(responseData?.total_amount || 0) >= parseFloat(formData?.invoice_amount || 0)) || (formData.invoice_files.some(file => file.invoice_file?.type !== 'application/pdf' || !file.invoice_file)) || (formData?.invoice_amount && !/^-?\d*\.?\d+$/.test(formData?.invoice_amount))}
                                            // disabled={!(parseFloat(responseData?.total_amount || 0) >= parseFloat(formData?.invoice_amount || 0)) || (formData.invoice_files.some(file => file.invoice_file?.type !== 'application/pdf' || !file.invoice_file)) || (formData?.invoice_amount && !/^[0-9]*$/.test(formData?.invoice_amount))}
                                            type="primary" htmlType="submit" id="btn-submit">
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
export default CreateInvoice;







