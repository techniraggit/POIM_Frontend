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
      
        createVendor({
            ...formData,
            // phone_number: '+1' + formData.contact_info[0].phone_number,
            contact_info: formData.contact_info.map((info) => {
                console.log(info,'info')
                if(!info.phone_number.includes('+1')) {
                    info.phone_number = '+1' + info.phone_number;
                }
                return info
            })
        }).then((response) => {
           
            if(response.data?.status) {
                message.success(response.data.message);
                router.push('/vendor');
            }
        })
        .catch((error)=>{
            message.error(error.response.data.message)
        })
    }
    console.log(formData)
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

    console.log(formData,'ffffffffffff');
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
                            <VendorForm form={form} onFinish={onFinish} 
                            setFormData={setFormData} formData={formData} 
                            onChange={onChange} repeatorData={repeatorData}
                           />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export { getServerSideProps }
export default withAuth(['admin', 'project manager', 'accounting', 'site superintendent','project coordinator'])(CreateVendor)