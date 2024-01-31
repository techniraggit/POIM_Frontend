import DynamicTitle from '@/components/dynamic-title';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons'
import '../styles/style.css'
import { Form, Input, Select, message, } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { useRouter } from 'next/router';
import axios from 'axios';
import { Spin } from 'antd';
import withAuth from '@/components/PrivateRoute';

const { Option } = Select;

const AddUser = ({ base_url }) => {
  const [roles, setRoles] = useState([]);
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchroles = async () => {
      try {
        const headers = {
          Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
        }
        const response = await axios.get(`${base_url}/api/admin/roles`, { headers: headers });
        setRoles(response.data.data); // Assuming the API response is an array of projects
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchroles();
    return () => {
      setLoading(false);
    };
  }, [])
  

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const data = {
        ...values,
      }

      const response = await axios.post(`${base_url}/api/admin/users`, data, {
        headers: headers,
      });

      if (response.status == 201) {
        message.success(response.data.message);
        router.push('/user-list')
      }
      
    }
    catch (error) {
      setLoading(false);
      message.error(error.response.data.message)
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
                  <div className="row mb-5">
                   
                    <div className="col-lg-4 col-md-6">
                      <div className="selectwrap react-select">

                        <Form.Item label="Select Role" name="role_id" 
                        // initialValue="select role" 
                        className='dropdown vender-input'
                        rules={[
                          {
                              required: true,
                              message: "Please Choose Role",
                          },
                      ]}
                        >
                          <Select className='arrow-wrap-user'>
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
                          <Input className='plus-wrap-input'
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            defaultValue="+"
                          />
                   {/* <PlusOutlined  className='plus-in-input'/> */}
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div class="wrap-box">
                        <Form.Item
                          label="Address"
                          name="address"  // Add a name to link the input to the form values
                          className="vender-input"
                          initialValue='1860 Shawson'
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
                          initialValue='Ontario'
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
                          initialValue='Canada'
                        >
                          <Input readOnly />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-12">
                      <Form.Item >
                        <button type="submit" className="create-ven-butt" loading={loading}>Submit</button>
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
  )
}
export { getServerSideProps };
export default withAuth(['admin','accounting'])(AddUser);