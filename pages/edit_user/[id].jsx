import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, message } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Spin } from 'antd';
import withAuth from "@/components/PrivateRoute";

const { Option } = Select;

const EditUser = ({ base_url }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/roles`, { headers: headers });
                setRoles(response.data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
        return () => {
            setLoading(false);
        };
    }, [])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                };
                const response = await axios.get(`${base_url}/api/admin/users?id=${id}`, {
                    headers: headers,
                });

                const userData = response.data.data;

                form.setFieldsValue({
                    role_id: response.data.data.user_role.id,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    address: userData.address,
                    state: userData.state,
                    country: userData.country

                })

            } catch (error) {
                console.error('error fetching data', error)
            }
        }
        fetchUserData();
    })

    const onFinish = async (values) => {
        const data = {
            id: id,
            ...values,
        }
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };

            const response = await axios.patch(`${base_url}/api/admin/users`, data, { headers: headers });
            message.success('User updated successfully');
            router.push('/user-list')
        } catch (error) {
            message.error(error.response.data.message)
            console.error('Error updating user:', error);
           
        }
    };

    const handlePhoneNumberChange = (value) => {
        if (isValidPhone(value)) {
            console.log('Valid phone number:', value);
        } else {
            console.log('Invalid phone number:', value);
        }
    };

    function isValidPhone(phoneNumber) {
        const pattern = /^\+(?:[0-9] ?){6,11}[0-9]$/;
        return phoneNumber && pattern.test(phoneNumber);
    }

    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="User" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-4 icon-text">
                                <i className="fa-solid fa-user me-3 mt-0"></i>
                                <span>Create User</span>
                            </li>
                        </ul>
                        <div class="choose-potype round-wrap"><div class="inner-choose">

                            <Spin spinning={loading}>
                                <Form onFinish={onFinish} layout="vertical" form={form}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    <div className="row mb-4">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap react-select">

                                                <Form.Item label="Role" name="role_id" initialValue="select role"
                                                    className='dropdown vender-input'
                                                    rules={[{ required: true, message: 'Please choose role!' }]}
                                                >
                                                    <Select >
                                                        {Array.isArray(roles) &&
                                                            roles.map((role) => (
                                                                <Option key={role.id} value={role.id}
                                                                >
                                                                    {role.name}
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="First Name"
                                                    name="first_name"
                                                    // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Last Name"
                                                    name="last_name"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[{ required: true, message: 'Please enter your last name!' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Email Address"
                                                    name="email"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[{ required: true, message: 'Please enter your email address!' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Contact No"
                                                    name="phone_number"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[
                                                        { required: true, message: 'Please enter your contact number!' },

                                                    ]}

                                                >
                                                    <Input
                                                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Address"
                                                    name="address"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="State / Province"
                                                    name="state"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[{ required: true, message: 'Please enter your state!' }]}
                                                // initialValue='Ontario'
                                                >
                                                    <Input readOnly />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Country"
                                                    name="country"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[{ required: true, message: 'Please enter your country!' }]}
                                                // initialValue='Canada'
                                                >
                                                    <Input readOnly />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item >
                                                <button type="submit" className="create-ven-butt" loading={loading}>Update</button>
                                            </Form.Item>
                                        </div>
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

export { getServerSideProps }

export default withAuth(['admin', 'accounting'])(EditUser);
