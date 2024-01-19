import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { createPO, getPoNumber } from "@/apis/apis/adminApis";
import { Form, Select, Button } from "antd";
import PoForm from '../components/Form';

const { Option } = Select;

const repeatorData = {
    description: '',
    date: '',
    amount: 0,
    project_site_id: ''
}

const CreateSubContractorPo = () => {
    const [formData, setFormData] = useState({
        po_number: '',
        po_type: '',
        amount: 0,
        company_name: '',
        vendor_id: '',
        project_id: '',
        vendor_contact_id: '',
        shipment_type: '',
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

    const [isNew, setISNew] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isNew) {
            const poNumberResponse = getPoNumber();
            poNumberResponse.then((res) => {
                if (res?.data?.status) {
                    form.setFieldValue('poNumber', res.data?.po_number);
                    setFormData({
                        ...formData,
                        po_number: res.data.po_number
                    });
                }
            })
        }
    }, [isNew]);

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const onFinish = () => {
        createPO({
            ...formData,
            subcontractor_type: isNew ? 'new' : 'existing'
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        });
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
                form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
            }
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
    }

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
                                <Form onFinish={onFinish} form={form} className="file-form">
                                    <div className="row po-typeraw">
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
                                            <div className="selectwrap react-select">
                                                <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                                    <Form.Item
                                                        label="Choose PO Type"
                                                        name="subcontractor_type"
                                                        class="bold-label"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose PO Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select  onChange={(value) => setISNew(value === 'new')} placeholder="Select PO Type" id="single1"
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
                                    <div class="order-choose d-flex">
                                        <div className="left-wrap wrap-number sub-po-typee">
                                            <Form.Item
                                                label="Purchase Order Number"
                                                name="poNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please enter Purchase Order Number',
                                                    },
                                                    {
                                                        pattern: /^\d{6,}$/, // Regular expression to ensure at least six digits
                                                        message: 'Purchase Order Number must be at least six digits',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter Po Number" onChange={({ target: { value } }) => onChange('po_number', value)} readOnly={isNew} />
                                            </Form.Item>
                                        </div>

                                    <PoForm formData={formData} isNew={isNew} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} />
                                    
                                    <div className="po-wrap create-wrap-butt m-0">
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="create-ven-butt">
                                                Create PO
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
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