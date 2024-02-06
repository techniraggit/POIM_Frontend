import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Select, Upload } from 'antd';
import '../../styles/style.css'
import React, { useEffect, useState } from "react";
import { downloadInvoice, fetchPoNumbers, fetchPoNumbr, getInvoiceData } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { useRouter } from 'next/router';
import Subcontractor_invoice from "@/components/subcontractor_invoice";
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { saveAs } from "file-saver";

const { TextArea } = Input;
const { Option } = Select;

const ViewInvoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [invoice, setInvoice] = useState({});
    const [po, setPo] = useState('');
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
                    form.setFieldValue('po_type', res.data?.data?.purchase_order?.po_type);
                    form.setFieldValue('po_number', res.data?.data?.purchase_order?.po_number);
                    setPo(res.data?.data?.purchase_order?.po_type)
                    fetchPoNumber(res.data?.data?.purchase_order?.po_id);
                }
            })
        }
    }, [id]);

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
            setResponseData(data)
            form.setFieldValue('po_id', id)
        })
    }

    const handleDownload = (id) => {
        downloadInvoice(id).then((res) => {
            const fileName = `invoice_${id}.pdf`;
            if(res?.data) {
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
                                            const invoice_file_split = data.invoice_file?.split('/')
                                            const fileName = invoice_file_split[invoice_file_split.length - 1];
                                            return (
                                                <>
                                                <div className="download-wrap d-flex">
                                                    <div className="download-fine-invoice">
                                                        {fileName} <DownloadOutlined onClick={() => handleDownload(data.file_id)} />
                                                    </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                    <Form.Item name={"note"} className="note-wrap wrap-box">
                                        <TextArea disabled />
                                    </Form.Item>
                                    <Form.Item name={"amount"} className="note-wrap wrap-box dollor-inputs">
                                        <Input disabled  addonBefore="$" />
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