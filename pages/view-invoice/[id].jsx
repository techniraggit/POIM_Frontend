import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload } from 'antd';
import '../../styles/style.css'
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr, getInvoiceData } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const repeatorData = {
    invoice_file: ''
}

const ViewInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [invoice, setInvoice] = useState({});
    const [responseData, setResponseData] = useState([]);
    const router = useRouter();
    const { id } = router.query;
    const [form] = Form.useForm();

    const onFinish = () => {
        
    };

    useEffect(() => {
        if(id) {
            const response = fetchPoNumbr()
            response.then((res) => {
                if (res?.data?.status) {
                    setPoNumber([...res.data.data]);
                }
            });
            const invoicePromise = getInvoiceData(id);

            invoicePromise.then((res) => {
                if(res?.data?.status) {
                    const data = res.data?.data
                    setInvoice({...data});
                    form.setFieldValue('amount', data.invoice_amount);
                    form.setFieldValue('note', data.comment);
                    fetchPoNumber(res.data?.data?.purchase_order?.po_id);
                }
            })
        }
    }, [id]);

    const fetchPoNumber = (id) => {
        const response = fetchPoNumbers(id)
        response.then((res) => {
            const data = res.data.data;
            setResponseData(data)
            form.setFieldValue('po_id', id)
        })
    }
    console.log(invoice.comment)
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
                                    <span>View Invoice</span>
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
                                    form={form}
                                >
                                    <div className="row mb-4">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap  shipment-caret invoice-select aligned-text">
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
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        invoice.invoice_files?.map((data, index) => {
                                            const invoice_file_split = data.invoice_file?.split('/')
                                            const fileName = invoice_file_split[invoice_file_split.length - 1];
                                            return (
                                                <>
                                                    <Upload disabled accept=".pdf" maxCount={1}>
                                                        <div>{fileName}</div>
                                                    </Upload>
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item name={"note"} className="note-wrap wrap-box">
                                        <TextArea disabled />
                                    </Form.Item>
                                    <Form.Item name={"amount"} className="note-wrap wrap-box">
                                        <Input disabled  />
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
export default ViewInvoice;