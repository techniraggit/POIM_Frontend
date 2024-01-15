import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Space, } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import DynamicTitle from '@/components/dynamic-title.jsx';
import withAuth from "@/components/PrivateRoute";
import { fetchVendorDetails, updateVendorDetails } from "@/apis/apis/adminApis";

const repeatorData = {
    id: "",
    name: "",
    phone_number: "",
    email: ""
}

const Vendor_Edit = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState({
        company_name: '',
        state: '',
        country: '',
        address: '',
        customer_name: '',
        contact_info: []
    })

    useEffect(() => {
        const response = fetchVendorDetails(id);
        response.then((res) => {
            if(res?.data?.status) {
                Object.keys(res.data.vendors_details).forEach((key) => {
                    if(key !== 'vendor_contact') {
                        form.setFieldValue(key, res.data.vendors_details[key])
                        formData[key] = res.data.vendors_details[key];
                    } else {
                        formData['contact_info'] = [...res.data.vendors_details[key]];
                    }
                });
                form.setFieldValue('name', res.data?.vendors_details?.vendor_contact[0]?.name);
                form.setFieldValue('phone_number', res.data?.vendors_details?.vendor_contact[0]?.phone_number);
                form.setFieldValue('email', res.data?.vendors_details?.vendor_contact[0]?.email);
                setFormData({
                    ...formData
                })
            }
        })
    }, []);

    const onChange = (name, value, index) => {
        if(name === 'contact_info') {
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
        console.log(formData)
        const response = updateVendorDetails({
            ...formData,
            vendor_id: id
        });
        response.then((res) => {
            if(res?.data?.status) {
                message.success('Vendor updated successfully');
                router.push('/vendor');
            }
        });
    };
    console.log(formData.contact_info.slice(1))
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
                                <span>Edit Vendor</span>
                            </li>
                        </ul>

                        <div className="vendor-form-create">
                            <Form onFinish={onFinish} layout="vertical" form={form}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                <div className="row">

                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Company Name"
                                                name="company_name"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your company name!' }]}
                                            >
                                                <Input onChange={({ target: { value } }) => onChange('contact_indo', { company_name: value }, 0)} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Contact Person Name"
                                                name="name"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your company name!' }]}
                                            >
                                                <Input onChange={({ target: { value } }) => onChange('contact_indo', { name: value }, 0)} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Contact No"
                                                name="phone_number"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your company name!' }]}
                                            >
                                                <Input onChange={({ target: { value } }) => onChange('contact_indo', { phone_number: value }, 0)} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Email Address"
                                                name="email"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your email address!' }]}
                                            >
                                                <Input onChange={({ target: { value } }) => onChange('contact_indo', { email: value }, 0)} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="State / Province"
                                                name="state"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your State / Province!' }]}
                                                initialValue='Ontario'
                                            >
                                                <Input readOnly />
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Country"
                                                name="country"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your country!' }]}
                                                initialValue='Canada'
                                            >
                                                <Input readOnly />
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Address"
                                                name="address"
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your  address!' }]}
                                            >
                                                <Input onChange={({ target: { value } }) => onChange('address', value)} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Customer Name"
                                                name="customer_name"
                                                className="vender-input"                                            
                                            >
                                                <Input onChange={({ target: { value } }) => onChange('customer_name', value)} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    
                                    <div className="create-another">
                                        <Space style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }} align="baseline" className="vendor-ant-form re-peator-vendorr">
                                            {
                                                formData.contact_info?.slice(1).map((contact, index) => {
                                                    return(
                                                        <>
                                                            <div className="repeator-row" style={{display: 'flex', columnGap: '8px'}}>
                                                                <div className="wrap-box" key={index}>
                                                                    <input
                                                                        htmlFor="id"
                                                                        name="id"
                                                                        type="hidden"
                                                                        value={contact.vendor_contact_id}
                                                                        onChange={(e) => onChange('id', e.target.value, index + 1)}
                                                                    />
                                                                </div>
                                                                <div className="wrap-box" key={index}>
                                                                    <label>Name</label>
                                                                    <input
                                                                        htmlFor="name"
                                                                        name="name"
                                                                        type="text"
                                                                        value={contact.name}
                                                                        onChange={(e) => onChange('contact_info', {'name': e.target.value}, index + 1)}
                                                                    />
                                                                </div>
                                                                <div className="wrap-box" key={index}>
                                                                    <label>Email</label>
                                                                    <input
                                                                        htmlFor="email"
                                                                        name="email"
                                                                        type="text"
                                                                        value={contact.email}
                                                                        onChange={(e) => onChange('contact_info', {'email': e.target.value}, index + 1)}
                                                                    />
                                                                </div>
                                                                <div className="minus-wraper1 wrap-box">
                                                                    <label>Phone Number</label>
                                                                    <input
                                                                        htmlFor="phone_number"
                                                                        name="phone_number"
                                                                        type="text"
                                                                        value={contact.phone_number}
                                                                        onChange={(e) => onChange('contact_info', {'phone_number': e.target.value}, index + 1)}
                                                                    />
                                                                </div>
                                                                <MinusOutlined className="minus-wrap" onClick={() => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        contact_info: [...formData.contact_info.slice(0, index + 1), ...formData.contact_info.slice(index + 2)]
                                                                    });
                                                                }} style={{ marginLeft: '8px' }} />
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            }
                                            <Form.Item className="vendor-edit-input">
                                                <div className="row">
                                                <Button className="add-more-btn edit-vendor-btn" type="dashed" onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        contact_info: [...formData.contact_info, repeatorData]
                                                    });
                                                }} icon={<PlusOutlined />}>
                                                    <span >Add Another Contact Person</span>
                                                </Button>
                                                </div>
                                            </Form.Item>
                                        </Space>
                                    </div>
                                    <Form.Item>
                                        <button type="submit" className="create-ven-butt">Update</button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export { getServerSideProps }
export default withAuth(['admin','accounting', 'project manager'])(Vendor_Edit)
