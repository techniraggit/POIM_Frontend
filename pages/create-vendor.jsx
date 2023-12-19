import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState } from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';


const Create_Vendor = ({ base_url }) => {
    const router = useRouter();
    const onFinish = async (values) => {


        const dynamicItems = values.items.map(item => ({
            name: item.name,
            phone_number: item.phone_number,
            email: item.email,
        }));

        const data = {
            ...values,
            // company_name:values.company_name,
        //     name:values.name,
        // customer_name:values.customer_name,
        // project_manager_id:rootData,
        contact_info:[...dynamicItems]  
        }
        console.log(data,'datataaaaaaa');

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
            console.log(response,'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
            message.success(response.data.message)
            // router.push('/vendor')
            
            // console.log(response.data.message,'messssssssssssssssssssssssageeeeee');
            // console.log(response, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        }
        catch (error) {
            console.log(error, 'catchhhhhhhhhhhhhhhhhhhh');
        }

        console.log(values, 'hfurhgiurehg');
    }


    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Vendor" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-4 icon-text">
                                <i className="fa-solid fa-user me-3 mt-0"></i>
                                <span>Create Vendor</span>
                            </li>
                        </ul>
                        <Form onFinish={onFinish} layout="vertical"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <div className="row">
                                
                                <Form.Item
                                    label="Company Name"
                                    name="company_name"
                                    // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your company name!' }]}
                                >
                                    <Input />
                                </Form.Item>




                                {/* {contactPersons.map((person, index) => (
                    <div key={index} className="row">
                        <Form.Item
                            label={`Name ${index + 1}`}
                            name={`contactPersons[${index}].name`}
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter the name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={`Email ${index + 1}`}
                            name={`contactPersons[${index}].email`}
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter the email!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={`Phone ${index + 1}`}
                            name={`contactPersons[${index}].phone`}
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter the phone number!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                ))} */}


                                <Form.Item
                                    label="Name"
                                    name="name"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your name!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Contact No"
                                    name="contact_no"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your contact number!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Email Address"
                                    name="email"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your email address!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="State / Province"
                                    name="state"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter state!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Country"
                                    name="country"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your country!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Address"
                                    name="address"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your address!' }]}
                                >
                                    <Input />
                                </Form.Item>







                                

                                <Form.List name="items">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'name']}
                                                        fieldKey={[fieldKey, 'name']}
                                                        label="Name"
                                                        rules={[{ required: true, message: 'Please enter name' }]}
                                                    >
                                                        <Input placeholder="Name" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'email']}
                                                        fieldKey={[fieldKey, 'email']}
                                                        label="Email"
                                                        rules={[{ required: true, message: 'Please enter email' }]}
                                                    >
                                                        <Input placeholder="Email" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'phone_number']}
                                                        fieldKey={[fieldKey, 'phone_number']}
                                                        label="Phone Number"
                                                        rules={[{ required: true, message: 'Please enter phone number' }]}
                                                    >
                                                        <Input placeholder="Phone Number" />
                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                <span >Add Another Contact Person</span>
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>




                                {/* <Form.Item>
                                    <button class="butt-flex" ><i class="fa-solid fa-plus"></i>
                                        <span >Add Another Contact Person</span>
                                    </button>
                                </Form.Item> */}
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <button type="submit" className="create-ven-butt">Submit</button>
                                </Form.Item>
                            </div>
                        </Form>

                    </div>
                </div>
            </div>
        </>
    )
}
export { getServerSideProps }
export default Create_Vendor