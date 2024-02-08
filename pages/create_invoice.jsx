import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload, message } from 'antd';
import '../styles/style.css'
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr, invoiceSubmit } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const repeatorData = {
    invoice_file: ''
}

const CreateInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [po, setPo] = useState('')
    const [form, setForm] = useState({
        comment: '',
        po_id: '',
        invoice_amount: '',
        invoice_files: [repeatorData]
    });

    const router = useRouter();

    const onFinish = () => {
        const formData = new FormData();
        formData.append('comment', form.comment);
        formData.append('invoice_amount', form.invoice_amount);
        formData.append('po_id', form.po_id);
        form.invoice_files?.forEach((file, index) => {
            formData.append(`invoice_file_${index}`, file.invoice_file);
        })

        const response = invoiceSubmit(formData)
        response.then((res) => {
            if (res.data.status_code == 201) {
                message.success(res.data.message);
                router.push('/invoice');
            }
        })
    };

    useEffect(() => {
        if(po){
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
            setForm({
                ...form,
                po_id: data.po_id,
            })
            setResponseData(data)
        })

    }

    const handlePoTypeChange =(value)=>{
        setPo(value)
    }

    const beforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('Only PDF files are allowed!');
        }
        return isPDF;
    };

    const onChange = (name, value, index) => {
        
        if (typeof index !== 'undefined') {
            form.invoice_files[index][name] = value;
        } else {
            form[name] = value;
        }
        setForm({
            ...form
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
                                    <span>Create Invoice</span>
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
                                    className="mt-5"
                                    onFinish={onFinish}
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
                                        </div>

                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap  shipment-caret invoice-select aligned-text">
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
                                                    <Select placeholder="Select PO Number" id="create-invoice"
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
                                        form.invoice_files?.map((data, index) => {
                                            return (
                                                <>
                                                    <div className="both-wrapinone d-flex align-items-center mb-3">
                                                        <Form.Item
                                                            name={`invoice_file` + index}
                                                            className="select-file-invoice mb-custom"
                                                            valuePropName="fileList"
                                                            getValueFromEvent={(e) => onChange('invoice_file', e.fileList[0].originFileObj, index)}
                                                        >
                                                            <Upload beforeUpload={beforeUpload} accept=".pdf" maxCount={1} className="upload-filewrap" >
                                                                <Button icon={<UploadOutlined />} className="file-btn" >Select File</Button>
                                                            </Upload>
                                                        </Form.Item>
                                                        {
                                                            index > 0 && <MinusOutlined className="minus-wrap" onClick={() => {
                                                                setForm({
                                                                    ...form,
                                                                    invoice_files: [...form.invoice_files.slice(0, index), ...form.invoice_files.slice(index + 1)]
                                                                });
                                                            }} style={{ marginLeft: '8px' }} />
                                                        }
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item>
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setForm({
                                                ...form,
                                                invoice_files: [...form.invoice_files, { ...repeatorData }]
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
                                    <Form.Item name={"amount"} className="note-wrap wrap-box dollor-inputs">
                                        {/* <span class="ant-input-group-addon">$</span> */}
                                        <Input
                                            onChange={({ target: { value } }) => onChange('invoice_amount', value)}
                                            placeholder={`Please enter amount`} addonBefore="$" />
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
export default CreateInvoice;