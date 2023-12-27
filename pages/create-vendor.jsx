import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';


const Create_Vendor = ({ base_url }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const onFinish = async (values) => {


        // const dynamicItems = values.items.map(item => ({
        //     name: item.name,
        //     phone_number: item.phone_number,
        //     email: item.email,
        // }));

        // const data = {
        //     ...values,
        //     contact_info: [...dynamicItems]
        // }
        // console.log(data, 'datataaaaaaa');


        if(values.items){
            const dynamicItems = values.items.map(item => ({
                name: item.name,
                phone_number: item.phone_number,
                email: item.email,
            }));
            var data = {
                ...values,
                contact_info: [...dynamicItems]
            };
        }
        else{
            var data = {
                ...values,
                contact_info: [
                    {
                        name: values.name,
                        phone_number: values.phone_number,
                        email: values.email,
                    }
                   
                ]
            };
        }

        // console.log(data,'hereeeeeeee')
        // return

        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            console.log("values === ", values)

            const response = await axios.post(`${base_url}/api/admin/vendors`, data, {
                headers: headers,
            });
            message.success(response.data.message)
            // router.push('/vendor')
            
            // console.log(response.data.message,'messssssssssssssssssssssssageeeeee');
            // console.log(response, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
            router.push('/vendor')


        }
        catch (error) {
        }

        console.log(values, 'hfurhgiurehg');
    }

    const handlePhoneNumberChange = (value) => {
        // If the value is exactly 10 digits, automatically add the +91 prefix
        if (value && /^\d{10}$/.test(value)) {
          form.setFieldsValue({
            phone_number: '+91' + value,
          });
        }
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
                            <li className="me-0 icon-text">
                                <i className="fa-solid fa-plus me-3 mt-0"></i>
                                <span>Create New Vendor</span>
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
                                                // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your company name!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Contact Person Name"
                                                name="name"
                                                // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your company name!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Contact No"
                                                name="phone_number"
                                                // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your company name!' }]}
                                            >
                                                <Input  onChange={(e) => handlePhoneNumberChange(e.target.value)}/>
                                            </Form.Item>
                                        </div>
                                    </div>
                                  

                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Email Address"
                                                name="email"
                                                // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your email address!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>


                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="State / Province"
                                                name="state"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your State / Province!' }]}
                                                initialValue='Ontario'
                                            >
                                                <Input readOnly/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Country"
                                                name="country"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your country!' }]}
                                                initialValue='Canada'
                                            >
                                                <Input readOnly/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Address"
                                                name="address"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your  address!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>


                                    {/* <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Contact No"
                                                name="contact_no"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter contact no!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div> */}


                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Customer Name"
                                                name="customer_name"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your customer name!' }]}
                                            >
                                                <Input />

                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="create-another">
                                        <Form.List name="items">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <div className="wrap-box">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'name']}
                                                                    fieldKey={[fieldKey, 'name']}
                                                                    label="Name"
                                                                    rules={[{ required: true, message: 'Please enter name' }]}
                                                                >
                                                                    <Input placeholder="Name" />
                                                                </Form.Item>
                                                            </div>

                                                            <div className="wrap-box">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'email']}
                                                                    fieldKey={[fieldKey, 'email']}
                                                                    label="Email"
                                                                    rules={[{ required: true, message: 'Please enter email' }]}
                                                                >
                                                                    <Input placeholder="Email" />
                                                                </Form.Item>
                                                            </div>

                                                            <div className="wrap-box">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'phone_number']}
                                                                    fieldKey={[fieldKey, 'phone_number']}
                                                                    label="Phone Number"
                                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                                >
                                                                    <Input placeholder="Phone Number" />
                                                                </Form.Item>
                                                            </div>


                                                            <MinusOutlined className="minus-wrap" onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                        </Space>
                                                    ))}
                                                
                                                    <Form.Item>
                                                        <Button className="add-more-btn" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                            <span >Add Another Contact Person</span>
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                        </div>  
                                    <Form.Item>
                                        <button type="submit" className="create-ven-butt">Submit</button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export { getServerSideProps }
export default Create_Vendor