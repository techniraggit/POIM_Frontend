import React, { useEffect, useRef, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { createPO, getPoNumber } from "@/apis/apis/adminApis";
import { Form, Select, Button, Input, message } from "antd";
import PoForm from '../components/Form';
import dayjs from "dayjs";
import { Spin } from 'antd';

const { Option } = Select;

const repeatorData = {
    description: '',
    date: '',
    amount: 0,
    project_site_id: ''
}

const CreateSubContractorPo = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        po_number: '',
        po_type: 'subcontractor',
        amount: 0,
        po_date: '',
        original_po_amount: '',
        invoice_amount: '',
        company_name: '',
        vendor_id: '',
        project_id: '',
        vendor_contact_id: '',
        shipment_type: 'project related',
        subcontractor_type: '',
        hst_amount: '',
        total_amount: '',
        country: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        delivery_address: '',
        quantity: 0,
        material_details: [{ ...repeatorData }]
    });
    const router = useRouter();
    const [form] = Form.useForm();
    const originalAmount = useRef(0);

    useEffect(() => {
        if (formData.subcontractor_type === 'new') {
            const poNumberResponse = getPoNumber();
            poNumberResponse.then((res) => {
                if (res?.data?.status) {
                    form.setFieldValue('poNumber', res.data?.po_number);
                    setFormData({
                        ...formData,
                        po_number: res.data.po_number,
                        po_date: dayjs().format('YYYY-MM-DD')
                    });
                }
            })
        } else {
            form.setFieldValue('poNumber', '');
            setFormData({
                ...formData,
                po_number: ''
            });
        }
    }, [formData.subcontractor_type]);

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const onFinish = () => {
        setLoading(true);
        createPO({
            ...formData,
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        })
        .catch((error) => {
            setLoading(false);
            message.error(error.response.data.message)
        })
    }

    const onChange = (name, value, index) => {
        if (name === 'material_details') {
            let totalAmount = 0;
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if (value.amount) {
                totalAmount = getTotalAmount();
            }
            formData.material_details[index] = {
                ...materalDetails
            };
            formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
            formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
            if (totalAmount > 0) {
                form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) || 0 });
                form.setFieldsValue({ 'total_amount':(totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
            }
            if (totalAmount > 0 && (totalAmount * 0.13 + totalAmount) > parseFloat(formData.original_po_amount)) {
                form.setFieldValue('original_po_amount', (totalAmount * 0.13 + totalAmount).toFixed(2) || 0);
                setFormData({
                    ...formData,
                    original_po_amount: (totalAmount * 0.13).toFixed(2) || 0
                })
            } else {
                form.setFieldValue('original_po_amount', originalAmount.current);
                setFormData({
                    ...formData,
                    original_po_amount: originalAmount.current
                })
            }
        } else {
            formData[name] = value;
        }
        if (name === 'original_po_amount') {
            originalAmount.current = value;
        }
        setFormData({
            ...formData
        });
    }

    const handlePoTypeChange = (value) => {
        if (value === 'material') {
            router.push('/create-material-po')
        } else if (value === 'rental') {
            router.push('/create-rental-po');
        }
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Purchase Orders' />
                    <div className="bottom-wrapp">

                        <ul class=" create-icons">
                            <li class="icon-text react-icon">
                                <PlusOutlined />
                                <span>Create Purchase Order</span>
                            </li>
                        </ul>
                        <div className="choose-potype round-wrap">
                            <div className="inner-choose">
                            <Spin spinning={loading}>
                                <Form onFinish={onFinish} form={form} className="file-form">
                                    <div className="row po-typeraw mb-5">
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
                                                            onChange={handlePoTypeChange}
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
                                            <div className="selectwrap react-select">
                                                <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                                    <Form.Item
                                                        label="Choose Subcontractor Type"
                                                        name="subcontractor_type"
                                                        class="bold-label"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose subcontractor Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select onChange={(value) => onChange('subcontractor_type', value)} placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                        >
                                                            <Option value="existing">Existing</Option>
                                                            <Option value="new">New</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(formData.subcontractor_type === 'existing') && (
                                        <>
                                            <div className="row mt-5 mb-3">
                                                <div class="col-lg-4 col-md-6">
                                                    <div class="wrap-box">
                                                        <Form.Item
                                                            label="Original PO Amount"
                                                            name="original_po_amount"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter Original PO Amount",
                                                                },
                                                            ]}
                                                        >
                                                            <Input 
                                                             addonBefore="$"
                                                            onChange={({ target: { value } }) => onChange('original_po_amount', value)} placeholder="Original PO Amount" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-md-6">
                                                    <div class="wrap-box">
                                                        <Form.Item
                                                            label="Invoice Recieved Amount"
                                                            name="invoice_amount"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter Invoice Recieved Amount",
                                                                },
                                                            ]}
                                                        >
                                                            <Input 
                                                             addonBefore="$"
                                                            onChange={({ target: { value } }) => onChange('invoice_amount', value)} placeholder="Invoice Recieved Amount" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                        </>

                                    )
                                    }
                                    <PoForm formData={formData} isNew={formData.subcontractor_type === 'new'} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} />

                                    <div className="po-wrap create-wrap-butt m-0">
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="create-ven-butt" loading={loading}>
                                                Create PO
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                                </Spin>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { getServerSideProps };

export default CreateSubContractorPo;