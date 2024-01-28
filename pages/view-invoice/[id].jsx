import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload, message } from 'antd';
import '../../styles/style.css'
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr, getInvoiceData, updateInvoice } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Roles from "@/components/Roles";

const { TextArea } = Input;

const repeatorData = {
    invoice_file: '',
    comment: '',
    invoice_amount: 0
}

const ViewInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [invoice, setInvoice] = useState({});
    const [responseData, setResponseData] = useState([]);
    const [repeator, setRepeator] = useState([repeatorData]);
    const [refetch, setRefetch] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    const onFinish = () => {
        
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
                    setInvoice({...res.data.data});
                    fetchPoNumber(res.data?.data?.purchase_order?.po_id);
                }
            })
        }
    }, [id, refetch]);

    const fetchPoNumber = (id) => {
        const response = fetchPoNumbers(id)
        response.then((res) => {
            const data = res.data.data;
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
                                invoice.status === 'pending' && <Roles action="approve_invoice">
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
                                <div className="row mb-4">
                                    <div className="col-lg-4 col-md-6">
                                        <div className="selectwrap  shipment-caret invoice-select aligned-text">
                                            <Select disabled placeholder="Select PO Type" id="create-invoice"
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
                                                                        <Upload disabled beforeUpload={beforeUpload} accept=".pdf" maxCount={1}>
                                                                            <Button icon={<UploadOutlined />} className="file-btn" >Select File</Button>
                                                                        </Upload>
                                                                    </Form.Item>
                                                                )
                                                            } else if(key === 'comment') {
                                                                return(
                                                                    <Form.Item name={"note" + index} className="note-wrap wrap-box">
                                                                        <TextArea disabled onChange={({ target: { value } }) => onChange('comment', value, index)} rows={8} placeholder={`Please enter a note`} />
                                                                    </Form.Item>
                                                                )
                                                            } else {
                                                                return(
                                                                    <Form.Item name={"amount" + index} className="note-wrap wrap-box">
                                                                        <Input disabled onChange={({ target: { value } }) => onChange('invoice_amount', value, index)} placeholder={`Please enter amount`} />
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
                                    {/* <Form.Item>
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setRepeator([...repeator, {...repeatorData}]);
                                        }} icon={<PlusOutlined />}>
                                            Add Invoice
                                        </Button>
                                    </Form.Item> */}
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
export default ViewInvoice;