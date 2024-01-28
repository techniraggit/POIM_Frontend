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

const repeatorData = {
    invoice_file: '',
    comment: '',
    invoice_amount: 0
}

const CreateInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [poId, setPoId] = useState('');
    const [repeator, setRepeator] = useState([repeatorData]);

    const router = useRouter();

    const onFinish = () => {
        const formData = new FormData();
        formData.append('po_id', poId);
        repeator.forEach((invoice, index) => {
            formData.append(`invoice_data[${index}][comment]`, invoice.comment);
            formData.append(`invoice_data[${index}][invoice_amount]`, invoice.invoice_amount);
            formData.append(`invoice_data[${index}][invoice_file]`, invoice.invoice_file);
        });
        const response = invoiceSubmit(formData)
        response.then((res) => {
            if (res.data.status_code == 201) {
                message.success(res.data.message);
                router.push('/invoice');
            }
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
            setPoId(data.po_id)
            setResponseData(data)
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
        repeator[index][name] = value;
        setRepeator([...repeator]);
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
                                    <span>View Purchase Order</span>
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
                                <div className="row mb-4">
                                    <div className="col-lg-4 col-md-6">
                                        <div className="selectwrap  shipment-caret invoice-select aligned-text">
                                            <Select placeholder="Select PO Type" id="create-invoice"
                                                class="js-states form-control file-wrap-select bold-select"
                                                onChange={(value) => fetchPoNumber(value)}
                                            >
                                                {poNumber.map((entry) => (
                                                    <Select.Option key={entry.po_id} value={entry.po_id}>
                                                        {entry.po_number}
                                                    </Select.Option>

                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <Form
                                    name="antdForm"
                                    className="mt-5"
                                    onFinish={onFinish}
                                >
                                    {
                                        repeator.map((data, index) => {
                                            return (
                                                <>
                                                    {
                                                        Object.keys(data).map((key) => {
                                                            if(key === 'invoice_file') {
                                                                return(
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
                                                                )
                                                            } else if(key === 'comment') {
                                                                return(
                                                                    <Form.Item name="note" className="note-wrap wrap-box">
                                                                        <TextArea onChange={({ target: { value } }) => onChange('comment', value, index)} rows={8} placeholder={`Please enter a note`} />
                                                                    </Form.Item>
                                                                )
                                                            } else {
                                                                return(
                                                                    <Form.Item name="amount" className="note-wrap wrap-box">
                                                                        <Input onChange={({ target: { value } }) => onChange('invoice_amount', value, index)} placeholder={`Please enter amount`} />
                                                                    </Form.Item>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    {
                                                        index > 0 && <MinusOutlined className="minus-wrap" onClick={() => {
                                                            setRepeator([...repeator.slice(0, index), ...repeator.slice(index + 1)]);
                                                        }} style={{ marginLeft: '8px' }} />
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item>
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setRepeator([...repeator, {...repeatorData}]);
                                        }} icon={<PlusOutlined />}>
                                            Add Invoice
                                        </Button>
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