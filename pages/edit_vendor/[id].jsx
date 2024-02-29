import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Button, Form, message } from 'antd';
import { useRouter } from 'next/router';
import DynamicTitle from '@/components/dynamic-title.jsx';
import withAuth from "@/components/PrivateRoute";
import { changeVendorStatus, fetchVendorDetails, updateVendorDetails } from "@/apis/apis/adminApis";
import VendorForm from "@/components/VendorForm";
import { useGlobalContext } from "@/app/Context/UserContext";

const repeatorData = {
    id: "",
    name: "",
    phone_number: "",
    email: ""
}

const VendorEdit = () => {
    const [form] = Form.useForm();
    const { user } = useGlobalContext();
    const router = useRouter();
    const { id } = router.query;
    const [refetch, setRefetch] = useState(true);
    const [formData, setFormData] = useState({
        company_name: '',
        state: '',
        country: '',
        city:'',
        address: '',
        customer_name: '',
        contact_info: []
    })

    useEffect(() => {
        if(refetch) {
            const response = fetchVendorDetails(id);
            response.then((res) => {
                if (res?.data?.status) {
                    const data = res.data?.vendors_details;
                    setFormData({
                        status: data?.status,
                        company_name: data.company_name,
                        state: data.state,
                        country: data.country,
                        address: data.address,
                        city:data.city,
                        customer_name: data.customer_name,
                        contact_info: [...data.vendor_contact]
                    })
                    data.vendor_contact.slice(1).forEach((contact, index) => {
                        Object.keys(contact).forEach((key) => {
                            form.setFieldValue(key + index, contact[key])
                        })
                    })
                    form.setFieldValue('company_name', data.company_name);
                    form.setFieldValue('state', data.state);
                    form.setFieldValue('country', data.country);
                    form.setFieldValue('city', data.city);
                    form.setFieldValue('customer_name', data.customer_name);
                    form.setFieldValue('address', data.address);
                    form.setFieldValue('name', data.vendor_contact[0]?.name);
                    form.setFieldValue('phone_number', data.vendor_contact[0]?.phone_number);
                    form.setFieldValue('email', data.vendor_contact[0]?.email);
                }
            })
            setRefetch(false);
        }
    }, [refetch]);

    const handleVendorStatusChange = (action) => {
        const response = changeVendorStatus({
            vendor_id: id,
            status: action
        });
        response.then((res) => {
            if(res?.data?.status) {
                setRefetch(true);
            }
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

    const onFinish = () => {
        const response = updateVendorDetails({
            ...formData,
            vendor_id: id
        });
        response.then((res) => {
            if (res?.data?.status) {
                message.success('Vendor updated successfully');
                router.push('/vendor');
            }
        })
        .catch((error)=>{
            message.error(error.response.data.message)
        })
    };

    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Vendor" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li class="bg-li-invoice justify-content-between d-flex align-items-center">
                                <div className="plus-wraptext d-flex align-items-center">
                                    <i className="fa-solid fa-plus me-3 mt-0"></i>
                                    <span>Edit Vendor</span>
                                </div>
                                {formData.status === 'pending' && <div className="mt-0 apr-rej-li d-flex">
                                    <Button type="primary" className="approved-btn me-3" onClick={(event) => {
                                        handleVendorStatusChange('approved');
                                    }}>Approve</Button>
                                    <Button type="primary" danger className="reject-btn" onClick={(event) => {
                                        handleVendorStatusChange('rejected');
                                    }}>Reject</Button>
                                </div>}
                                {
                                    user.role === "admin" && formData.status === 'rejected' && <button style={{backgroundColor: 'red'}} className="po-status-btn">
                                        Rejected
                                    </button>
                                }
                                {
                                    user.role === "admin" && formData.status === 'approved' && <button className="po-status-btn">
                                        Approved
                                    </button>
                                }
                            </li>
                        </ul>

                        <div className="vendor-form-create">
                            <VendorForm form={form} setFormData={setFormData} formData={formData} onFinish={onFinish} onChange={onChange} repeatorData={repeatorData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(['admin', 'accounting', 'project manager'])(VendorEdit)
