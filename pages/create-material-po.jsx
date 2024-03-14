import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { createPO, getPoNumber } from "@/apis/apis/adminApis";
import { Form, Select, Button,message } from "antd";
import PoForm from '../components/Form';

const { Option } = Select;

const repeatorData = {
    quantity: '',
    unit_price: '',
    amount: 0,
    description: '',
    material_for: '',
    code: '',
    project_id: '',
    project_site_id: '',
}

const CreateMaterialPo = () => {
    const [formData, setFormData] = useState({
        po_number: '',
        po_type: 'material',
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
        material_details: [{ ...repeatorData }]
    });

    const router = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
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
    }, []);

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount || 0;
    };
    const onFinish = () => {
        createPO({
            ...formData,
            // phone_number:'1'+ formData.phone_number
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        })
            .catch((error) => {
                message.error(error.response.data.message)
            })
    }

    const calculateAmount = (quantity, unit_price, index) => {
        const amount = ((parseFloat(quantity) * parseFloat(unit_price))) || 0;
        const materialDetails = formData.material_details[index];
        materialDetails.amount = amount;
        formData.material_details[index] = {
            ...materialDetails
        };
        const totalAmount = getTotalAmount();
        formData.total_amount = totalAmount > 0 ? (totalAmount * 0.13 + totalAmount) : formData.total_amount;
        formData.hst_amount = totalAmount > 0 ? (totalAmount * 0.13) : formData.hst_amount;
        if (totalAmount > 0) {
            form.setFieldsValue({ 'hst_amount': ((totalAmount * 0.13)).toLocaleString() || 0 });
            form.setFieldsValue({ 'total_amount': ((totalAmount * 0.13 + totalAmount)).toLocaleString() || 0 });
        }
    }

    const onChange = (name, value, index) => {
        if(name==='shipment_type'){
            formData?.material_details.forEach((material, index) => {
                form.setFieldValue('material_for' + (index), '')
                formData.material_details[index].material_for = '';
            })
        }
        if (name === 'material_details') {
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if (value.unit_price) {
                calculateAmount(formData.material_details[index].quantity, value.unit_price, index);
            }
            if (value.quantity) {
                calculateAmount(value.quantity, formData.material_details[index].unit_price, index);
            }
            formData.material_details[index] = {
                ...materalDetails
            };
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
    }

    formData?.material_details.forEach((data, index) => {
        form.setFieldValue(('amount' + (index)), data.amount.toLocaleString())
    })

    const handlePoTypeChange = (value) => {
        if (value === 'rental') {
            router.push('/create-rental-po');
        }
        if (value === 'subcontractor') {
            router.push('/create-subcontractor-po');
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
                                                        <Select placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                            onChange={handlePoTypeChange} nge={handlePoTypeChange}
                                                        >
                                                            <Option value="material">Material PO</Option>
                                                            <Option value="rental">Rental PO</Option>
                                                            <Option value="subcontractor">Sub Contractor PO</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    

                                        <PoForm 
                                            formData={formData}
                                            isNew={true}
                                            form={form} 
                                            onChange={onChange} 
                                            onFinish={onFinish}
                                            setFormData={setFormData} 
                                            calculateAmount={calculateAmount} 
                                        />
                                    

                                    <div className="po-wrap create-wrap-butt m-0">
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="create-ven-butt" >
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
export default CreateMaterialPo;