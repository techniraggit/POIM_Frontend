import DynamicTitle from '@/components/dynamic-title';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';
import '../styles/style.css'
import { Form, Input, Button, Select, message, } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { useRouter } from 'next/router';
import axios from 'axios';

const { Option } = Select;


const AddUser = ({ base_url }) => {
  const [roles, setRoles] = useState([]);
  const router = useRouter();

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
  }, [])

  const onFinish = async (values) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      console.log("values === ", values)
      const data = {
        ...values,
      }
     
        const response = await axios.post(`${base_url}/api/admin/users`, data, {
          headers: headers,
        });
        console.log(response.data.message,'jjjjjjjjjjjjjj');
        if(response.status==true){
        message.success(response.data.message);
        router.push('/user-list')
      }
    }
    catch (error) {
      message.error(error.response.data.message)
    }
  };
 
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
                <span>Create New User</span>
              </li>
            </ul>
            <Form onFinish={onFinish} layout="vertical"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <div className="row">
<<<<<<< HEAD
                {/* <div className="Role">
                  <p>Role</p>
                </div> */}
                <div className="col-md-4 after-wrap">
=======
>>>>>>> 2ca6b320cbec4f4ebc4816bd48b833c64843b043
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
                <div className="row">
                <div className="col-lg-4 col-md-6">
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
                <div className="col-lg-4 col-md-6">
                <Form.Item
                  label="Last Name"
                  name="last_name"  // Add a name to link the input to the form values
                  className="vender-input"
                  rules={[{ required: true, message: 'Please enter your last name!' }]}
                >
                  <Input />
                </Form.Item>
                </div>
                <div className="col-lg-4 col-md-6">
                <Form.Item
                  label="Email Address"
                  name="email"  // Add a name to link the input to the form values
                  className="vender-input"
                  rules={[{ required: true, message: 'Please enter your email address!' }]}
                >
                  <Input />
                </Form.Item>
                </div>
                <div className="col-lg-4 col-md-6">
                <Form.Item
                  label="Contact Number"
                  name="phone_number"  // Add a name to link the input to the form values
                  className="vender-input"
                  rules={[{ required: true, message: 'Please enter your contact number !' }]}
                >
                  <Input />
                </Form.Item>
                </div>
                <div className="col-lg-4 col-md-6">
                <Form.Item
                  label="Address"
                  name="address"  // Add a name to link the input to the form values
                  className="vender-input"
                  rules={[{ required: true, message: 'Please enter your address !' }]}
                >
                  <Input />
                </Form.Item>
                </div>
                <div className="col-lg-4 col-md-6">
                <Form.Item
                  label="State / Province"
                  name="state"  // Add a name to link the input to the form values
                  className="vender-input"
                  rules={[{ required: true, message: 'Please enter your state!' }]}
                >
                  <Input />
                </Form.Item>
                </div>
                <div className="col-lg-4 col-md-6">
                <Form.Item
                  label="Country"
                  name="country"  // Add a name to link the input to the form values
                  className="vender-input"
                  rules={[{ required: true, message: 'Please enter your country!' }]}
                >
                  <Input />
                </Form.Item>
                </div>
                <div className="col-lg-12 col-md-12">
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <button type="submit" className="create-ven-butt">Submit</button>
                </Form.Item>
                </div>
              </div>
            </Form>
            
          </div>
        </div>
      </div>
    </>
  )
}
export { getServerSideProps };
export default AddUser