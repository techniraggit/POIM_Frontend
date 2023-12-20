import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';


const Create_Vendor = ({ base_url }) => {
    const [managers, setManagers] = useState([]);
    const [rootData, setRootData] = useState('')


    // const [formData, setFormData] = useState([]);
    const router = useRouter();


    useEffect(() => {
        const fetchmanagers = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/helping/project-managers`, { headers: headers });
                console.log(response.data.managers, '55555555555555555555555555');
                setManagers(response.data.managers); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchmanagers();
    }, [])

    const onFinish = async (values) => {
        const dynamicItems = values.items.map(item => ({
            name: item.name,
            address: item.address,
            state: item.state,
        }));
        
        // Add values from static fields to the beginning of dynamicItems array
        // const finalFormValues = [
        //     {
        //         name: values.name,
        //         address: values.address,
        //         state: values.state,
        //     },
        //     ...dynamicItems
        // ];

        const test = {
            name:values.name,
            customer_name:values.customer_name,
            project_manager_id:rootData,
            project_sites:[...dynamicItems]      
        }

        console.log('Final Form Values:', test);

        
        // return 

        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            console.log("values === ", values)
            // const data = {
            //     ...values,
            //     project_manager_id: rootData
            // }
            // const siteData = {
            //     ...values,
            //     name: values.name,
            //     address: values.address,
            //     site: values.site,
            //     project_id: site
            // }
            const response = await axios.post(`${base_url}/api/admin/projects`, test, {
                headers: headers,
            });
            console.log(response, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
            message.success(response.data.message)
            // setFormData(values.items);

            router.push('/project')
        }
        catch (error) {
            console.log(error, 'catchhhhhhhhhhhhhhhhhhhh');
        }

        console.log(values, 'hfurhgiurehg');
    }
    const project = (id) => {
        console.log(id, 'ttttttttttttttttttttttttttt');
        setRootData(id);
    }


    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-4 icon-text">
                                <i className="fa-solid fa-user me-3 mt-0"></i>
                                <span>Create Project</span>
                            </li>
                        </ul>
                        <Form onFinish={onFinish} layout="vertical"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <div className="row">

                                <Form.Item
                                    label="Project Name"
                                    name="name"
                                    // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your project name!' }]}
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


                                <Form.Item label="Select Maneger" name="role_id" initialValue="" className='dropdown vender-input'>
                                    <Select onChange={(value) => project(value)}>
                                        {Array.isArray(managers) &&
                                            managers.map((manager) => (
                                                <Option key={manager.id} value={manager.id}
                                                >
                                                    {manager.first_name}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Customer Name"
                                    name="customer_name"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your customer!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                {/* <Form.Item
                                    label="Address"
                                    name="address"  // Add a name to link the input to the form values
                                    className="vender-input"
                                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                                >
                                    <Input />
                                </Form.Item> */}




                                {/* <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        // {...restField}
                                        name='name'
                                        // fieldKey={[fieldKey, 'itemName']}
                                        label="Site Name"
                                        rules={[{ required: true, message: 'Please enter name' }]}
                                    >
                                        <Input placeholder="Name" />
                                    </Form.Item>

                                    <Form.Item
                                        // {...restField}
                                        // name={[name, 'address']}
                                        name='address'
                                        // fieldKey={[fieldKey, 'itemAddress']}
                                        label="Site Address"
                                        rules={[{ required: true, message: 'Please enter address' }]}
                                    >
                                        <Input placeholder="address" />
                                    </Form.Item>

                                    <Form.Item
                                        // {...restField}
                                        // name={[name, 'state']}
                                        name='state'
                                        // fieldKey={[fieldKey, 'site']}
                                        label="Site"
                                        rules={[{ required: true, message: 'Please enter site' }]}
                                    >
                                        <Input placeholder="Site State" />
                                    </Form.Item>

                                </Space> */}





                                <Form.List name="items">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'name']}
                                                        fieldKey={[fieldKey, 'itemName']}
                                                        label="Site Name"
                                                        rules={[{ required: true, message: 'Please enter name' }]}
                                                    >
                                                        <Input placeholder="Name" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'address']}
                                                        fieldKey={[fieldKey, 'itemAddress']}
                                                        label="Site Address"
                                                        rules={[{ required: true, message: 'Please enter address' }]}
                                                    >
                                                        <Input placeholder="address" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'state']}
                                                        fieldKey={[fieldKey, 'site']}
                                                        label="Site"
                                                        rules={[{ required: true, message: 'Please enter site' }]}
                                                    >
                                                        <Input placeholder="Site State" />
                                                    </Form.Item>

                                                    <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                    <span >Add site</span>
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