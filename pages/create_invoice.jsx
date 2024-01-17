import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select, Upload, message } from 'antd';
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr, invoiceSubmit } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";
import Rental_invoice from "@/components/rental_invoice";
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { TextArea } = Input;

const { Option } = Select;

const Create_Invoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [poId, setPoId] = useState('')
    const router = useRouter();


    const onFinish = (values) => {
        // Handle form submission here
        console.log('Received values:', values);
        const formData = new FormData();
        formData.append('po_id', poId);

        // Check if a file is present before appending to FormData
        if (values.invoice_file && values.invoice_file.length > 0) {
            const file = values.invoice_file[0].originFileObj;
            formData.append('invoice_file', file);
        }

        console.log(formData, 'FormData object');
        const response = invoiceSubmit(formData)
        console.log(response,'ddddddddddddd');
        response.then((res) => {
            console.log(res.data, 'qqqqqqqqqqqqqqqq');
            if(res.data.status_code == 201){
                message.success(res.data.message);
                router.push('/invoice');
            }
        })
    };
    useEffect(() => {
        const response = fetchPoNumbr()
        response.then((res) => {
            console.log(res.data.data, 'sssssssssssssssss');
            if (res?.data?.status) {
                setPoNumber([...res.data.data]);
            }
        })

    }, [])

    const fetchPoNumber = (id) => {
        console.log(id, 'iddddd');
        const response = fetchPoNumbers(id)
        console.log(response, 'iiiiiiiiiiiiiiii');
        response.then((res) => {

            console.log(res.data.data.po_id, 'wwwwwwwwww');
            const data = res.data.data;
            setPoId(data.po_id)
            setResponseData(data)

        })
    }

    const props = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        beforeUpload: () => false, // Prevent default upload behavior
    };

    const beforeUpload = (file) => {
        // Validate file type or size if needed
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('Only PDF files are allowed!');
        }
        // Returning false prevents file upload
        return isPDF;
    };

    return (
        <>
            <div class="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Invoice' />
                    <div class="bottom-wrapp-purchase">

                        <div class="wrapp-in-voice">
                            <ul class="bg-colored-ul">
                                <li class="bg-li">
                                    <i class="fa-solid fa-plus me-3 mt-0"></i>
                                    <span>View Purchase Order</span>
                                </li>

                            </ul>


                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="selectwrap  shipment-caret aligned-tex">
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
                            <Form
                                name="antdForm"
                                className="choose-file"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="invoice_file"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                >
                                    <Upload beforeUpload={beforeUpload} accept=".pdf" maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                </Form.Item>
                                {/* <Form.Item name="invoice_file" valuePropName="fileList" getValueFromEvent={() => null}>
                                    <Input type='file' />   
                                </Form.Item> */}

                                <Form.Item name="note">
                                    <TextArea rows={8} placeholder="Please enter a note here." />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" id="btn-submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                            {/* <form class="choose-file">
                                <div class="inner-file-input">
                                    <h6>Drag & drop any file here</h6>
                                    <input type="file" name="" id="" />
                                    <div class="note-wrap">
                                        <p>
                                            <i class="fa-solid fa-exclamation me-3"></i> Please select a file first!
                                        </p>
                                    </div>
                                </div>
                                <div class="text-areaa">
                                    <textarea name="" id="" cols="30" rows="8" placeholder="Please enter a note here."></textarea>
                                </div>
                                <button type="submit" id="btn-submit">Submit</button>
                            </form> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default Create_Invoice