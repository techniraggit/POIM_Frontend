import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Space, } from 'antd';
import { EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import Link from "next/link";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Spin } from 'antd';
import withAuth from "@/components/PrivateRoute";

const { Option } = Select;

const Vendor_Edit = ({ base_url }) => {
    const [form] = Form.useForm();

    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    // const [vendors, setVendors] = useState([]);
    // const [totalVendor, setTotalVendor] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/roles`, { headers: headers });
                console.log(response, 'ddddddddddd');
                setRoles(response.data.data); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
        return () => {
            // Cleanup function to reset loading when the component unmounts
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
                // const data = {
                //     ...values,
                // }

                const response = await axios.get(`${base_url}/api/admin/users?id=${id}`, {
                    headers: headers,
                });
                console.log(response.data.data.user_role.id, 'jjjjjjjjjjjjjj');

                const userData = response.data.data;
                console.log(userData, '$$$$$$$$$$$$$$$$$');

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
    // const handleEditClick = (vendor) => {
    //     setSelectedVendor(vendor);
    // };

    const onFinish = async (values) => {
        console.log(values, 'user values');
        //     if (values.items?.length > 0) {
        //         const dynamicItems = values.items.map(item => ({
        //             id: item.id,
        //             name: item.name,
        //             phone_number: item.phone_number,
        //             email: item.email,
        //         }));
        //         var data = {
        //             ...values,
        //             vendor_id: itemsData[0].vendor_id,
        //             contact_info: [...dynamicItems]
        //         };
        //         console.log(data, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhh');
        //     }
        //     else {
        //         var data = {
        //             ...values,
        //             vendor_id: id,
        //             contact_info: [
        //                 {
        //                     id: values.id,
        //                     name: values.name,
        //                     phone_number: values.phone_number,
        //                     email: values.email,
        //                 }
        //             ]
        //         };
        //     }
        const data = {
            id: id,
            ...values,
        }
        // console.log(data,'00000000000000000');
        // return


        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };

            // Make a PUT request to update the vendor
            const response = await axios.patch(`${base_url}/api/admin/users`, data,
                {
                    headers: headers,

                }
            );
            console.log(response, 'vendor edit rsponse');

            // Display a success message
            message.success('Project updated successfully');
            router.push('/user-list')

            // Reset the selected vendor and refetch the updated list
            setSelectedUser(null);
            // fetchRoles();
        } catch (error) {
            console.error('Error updating project:', error);
            // Display an error message
            message.error('Error updating project');
        }
    };

    const handlePhoneNumberChange = (value) => {
        // If the value is exactly 10 or 11 digits, automatically add the appropriate prefix
        if (isValidPhone(value)) {
          // Do something with the valid phone number
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
                                    <div className="row">
                                        {/* <div className="Role">
                    <p>Role</p>
                  </div> */}
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap react-select">

                                                <Form.Item label="Role" name="role_id" initialValue="select role" className='dropdown vender-input'>
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
                                        {/* <div className="col-lg-4 col-md-6">
                      <div class="wrap-box">
                        <Form.Item
                          label="Edit Password"
                          name="address"  // Add a name to link the input to the form values
                          className="vender-input"
                          rules={[{ required: true, message: 'Please enter your address !' }]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    </div> */}
                                        {/* <div className="col-lg-4 col-md-6">
                      <div class="wrap-box">
                        <Form.Item
                          label="Confirm New Password"
                          name="state"  // Add a name to link the input to the form values
                          className="vender-input"
                          rules={[{ required: true, message: 'Please enter your state!' }]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    </div> */}
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Address"
                                                    name="address"  // Add a name to link the input to the form values
                                                    className="vender-input"
                                                    rules={[{ required: true, message: 'Please enter your address!' }]}
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
                                            {/* <Form.Item>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                          </Button>
                        </Form.Item> */}
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
export default withAuth(['admin','accounting'])(Vendor_Edit);
// export default Vendor_Edit;
