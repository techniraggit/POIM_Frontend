import React, { useEffect, useState } from 'react'
import Sidebar from "@/components/sidebar";
import Header from '@/components/header';
import { getUserData, profileSave } from '@/apis/apis/adminApis';
import { Form, Input, Select, message, } from 'antd';
import { useRouter } from "next/router";
import { PlusOutlined } from '@ant-design/icons';

const Profile = () => {
    const [profileData, setProfiledata] = useState('')
    const router = useRouter();
    const [form] = Form.useForm();
    useEffect(() => {
        getUserData().then((res) => {
            setProfiledata(res.data.data)
        })
    }, [])

    const onFinish = (values) => {

        // const { new_password, confirm_password } = values;

        // if (new_password !== confirm_password) {
        //     form.setFields({
        //         confirm_password: {
        //             value: confirm_password,
        //             errors: ['Confirm password does not match with the new password'],
        //         },
        //     });
        //     return;
        // }

        profileSave({
            ...values,
        }).then((res) => {
            if (res?.data?.status) {
                message.success(res.data.message);
                form.resetFields();
            }
        })
            .catch((error) => {
                message.error(error.response.data.message)
            })
    }

    return (

        <div>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Profile" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                        <li class="icon-text react-icon">
                                <PlusOutlined />
                                <span> Update Profile</span>
                            </li>
                        </ul>
                        <div className="vendor-form">
                            <div className="row first-section align-items-center">

                                <div className="col-lg-4 col-md-12 ">
                                    <div className="user-image">
                                        <img src='/images/avtar.png' class="user-img" />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-12 ">
                                    <div className="vender-input">
                                        <label for="">First Name</label>
                                        <p>{profileData.first_name
                                        }</p>
                                        {/* <input type="text" name="" id=""/> */}
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Last Name</label>
                                        <p>{profileData.last_name}</p>
                                        {/* <input type="text" name="" id="" /> */}
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Email</label>
                                        <p>{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Phone No</label>
                                        <p>{profileData.phone_number}</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Address</label>
                                        <p>{profileData.address}</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">State / Province</label>
                                        <p>{profileData.state}</p>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Country</label>
                                        <p>{profileData.country}</p>
                                    </div>
                                </div>
                            </div>
                            <Form className='profile-wrapp-form'
                                onFinish={onFinish} layout="vertical" form={form}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                <div className="row top-border">
                                    <div className="col-lg-4 col-md-6">
                                        <div class="wrap-box">
                                            <Form.Item
                                                label="Old Password"
                                                name="old_password"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your old password!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div class="wrap-box">
                                            <Form.Item
                                                label="New Password"
                                                name="new_password"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your new password!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div class="wrap-box">
                                            <Form.Item
                                                label="Confirm Password"
                                                name="confirm_password"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[
                                                    { required: true, message: 'Please enter your confirm password!' },
                                                    ({getFieldValue}) => ({
                                                        validator(_, value) {
                                                            if (!value || getFieldValue('new_password') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('This password not match with new password!'));
                                                        },
                                                    }),
                                                ]}
                                                // rules={[{ required: true, message: 'Please enter your confirm password!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Form.Item >
                                            <button  htmlType="submit" className="create-ven-butt">Save Changes</button>
                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Profile
