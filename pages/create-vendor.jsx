import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Form, message } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { useRouter } from 'next/router';
import withAuth from "@/components/PrivateRoute";
import VendorForm from "@/components/VendorForm";
import { createVendor } from "@/apis/apis/adminApis";

const repeatorData = {
    email: '',
    name: '',
    phone_number: ''
}

const CreateVendor = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [formData, setFormData] = useState({
        company_name: '',
        country: 'Canada',
        customer_name: '',
        state: 'Ontario',
        city:'',
        address: '',
        contact_info: [repeatorData]
    });

    const onFinish = () => {
        createVendor(formData).then((response) => {
            if(response.data?.status) {
                message.success("Vendor Created");
                router.push('/vendor');
            }
        })
        .catch((error)=>{
            message.error(error.response.data.message)
        })
    }

    const onChange = (name, value, index) => {
        if (name === 'contact_info') {
            const contactInfo = formData.contact_info[index];
            Object.keys(value).forEach((key) => {
                contactInfo[key] = value[key];
            });

            formData.contact_info[index] = {
                ...contactInfo
            };
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
    }

    // const handlePhoneNumberChange = (value) => {
    //     // If the value is exactly 10 or 11 digits, automatically add the appropriate prefix
    //     if (isValidPhone(value)) {
    //         // Do something with the valid phone number
    //         console.log('Valid phone number:', value);
    //     } else {
    //         console.log('Invalid phone number:', value);
    //     }
    // };

    // function isValidPhone(phoneNumber) {
    //     const pattern = /^\+(?:[0-9] ?){6,11}[0-9]$/;
    //     return phoneNumber && pattern.test(phoneNumber);
    // }

    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Vendor" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-0 icon-text">
                                <i className="fa-solid fa-plus me-3 mt-0"></i>
                                <span>Create New Vendor</span>
                            </li>
                        </ul>

                        <div className="vendor-form-create">
                            <VendorForm form={form} onFinish={onFinish} setFormData={setFormData} formData={formData} onChange={onChange} repeatorData={repeatorData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export { getServerSideProps }
export default withAuth(['admin', 'project manager', 'accounting', 'supervisor','project coordinate'])(CreateVendor)