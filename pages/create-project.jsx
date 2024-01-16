import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from "@/components/PrivateRoute";
import { projectNumber } from "@/apis/apis/adminApis";


const Create_Vendor = ({ base_url }) => {
    const [managers, setManagers] = useState([]);
    const [rootData, setRootData] = useState('')

    const [form] = Form.useForm();
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
        if(values.items){
            const dynamicItems = values.items.map(item => ({
                name: item.name,
                address: item.address,
                state: item.state,
            }));



            var test = {
                ...values,
                name: values.name,
                customer_name: values.customer_name,
                project_manager_id: rootData,
                project_sites: [...dynamicItems]
            }


            
        }
        else{
            var test = {
                ...values,
                project_sites: [
                    {
                        name: values.name,
                        address: values.address,
                        state: values.state,
                    }
                   
                ]
            };
        }







        

        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
           
            const response = await axios.post(`${base_url}/api/admin/projects`, test, {
                headers: headers,
            });
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
        setRootData(id);
    }
    
    // const fetchProjectNumber=()=>{
    //     const projectNumberResponse= projectNumber()
    //     projectNumberResponse.then((res)=>{
    //         if(res?.data) {
    //             console.log(res.data.project_number,'oooooooooooooooooooo');
    //         form.setFieldValue('project_number',res.data.project_number)
    //             // form.setFieldValue('poNumber', response.data.po_number);
    //         }

    //     })
    // }



    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-0 icon-text">
                                <i className="fa-solid fa-user me-3 mt-0"></i>
                                <span>Create New Project</span>
                            </li>
                        </ul>

                        <div className="vendor-form-create">

                            <Form onFinish={onFinish} form={form} layout="vertical"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >
                                <div className="row">
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Project Name"
                                                name="project_name"
                                                // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your project name!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Project Number"
                                                name="project_number"
                                                className="vender-input"
                                                // initialValue="00854"
                                                rules={[{ required: true, message: 'Please enter your project number!' }]}
                                            >
                                                <Input placeholder="00854" 
                                                // onClick={() => fetchProjectNumber()}
                                                //  readOnly
                                                 />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-lg-4 col-md-12 shipment-caret">
                                        <div className="selectwrap bg-border-select">
                                            <Form.Item label="Project Maneger" name="project_manager_id" initialValue="" className="vender-input">
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
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-4 col-md-12">
                                    <div className="wrap-box">
                                            <Form.Item
                                                label="Site Name"
                                                name="name"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your site address!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Site Address"
                                                name="address"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your site address!' }]}
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
                                                rules={[{ required: true, message: 'Please enter your State Province!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>


                                <div className="create-another">
                                    <Form.List name="items">

                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                        <div className="wrap-box mb-0">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'name']}
                                                                fieldKey={[fieldKey, 'itemName']}
                                                                label="Site Name"
                                                                rules={[{ required: true, message: 'Please enter name' }]}
                                                            >
                                                                <Input placeholder="Name" />
                                                            </Form.Item>
                                                        </div>

                                                        <div className="wrap-box mb-0">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'address']}
                                                                fieldKey={[fieldKey, 'itemAddress']}
                                                                label="Site Address"
                                                                rules={[{ required: true, message: 'Please enter address' }]}
                                                            >
                                                                <Input placeholder="address" />
                                                            </Form.Item>
                                                        </div>

                                                        <div className="wrap-box mb-0">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'state']}
                                                                fieldKey={[fieldKey, 'site']}
                                                                label="Site"
                                                                rules={[{ required: true, message: 'Please enter site' }]}
                                                            >
                                                                <Input placeholder="Site State" />
                                                            </Form.Item>
                                                        </div>
                                                        <MinusOutlined className="minus-wrap" onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                    </Space>
                                                ))}
                                                <Form.Item>
                                                    <Button className="add-more-btn" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                        <span >Add One More Site</span>
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                    <div className="col-lg-4 col-md-12 mt-4">
                                        <div className="wrap-box">
                                            <Form.Item
                                                label="Customer Name"
                                                name="customer_name"  // Add a name to link the input to the form values
                                                className="vender-input"
                                                rules={[{ required: true, message: 'Please enter your State Province!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    </div>
                                    <Form.Item >
                                        <button type="submit" className="create-ven-butt">Create Project</button>
                                    </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export { getServerSideProps }
export default withAuth(['admin','accounting'])(Create_Vendor)
// export default Create_Vendor