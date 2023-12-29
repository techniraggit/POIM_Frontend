import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Space,Select } from 'antd';
import { EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import Link from "next/link";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import DynamicTitle from '@/components/dynamic-title.jsx';


const { Option } = Select;

const Project_Edit = ({ base_url }) => {
    const [form] = Form.useForm();
   
    const router = useRouter();
    const { id } = router.query;
    const [managers, setManagers] = useState([]);
    const [rootData, setRootData] = useState('')
    const [vendors, setVendors] = useState([]);
    const [totalVendor, setTotalVendor] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState(null);

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
    useEffect(()=>{
        const fetchProjectData = async () => {



            // if(values.items?.length>0){
            //     const dynamicItems = values.items.map(item => ({
            //         id:item.id,
            //         name: item.name,
            //         address: item.address,
            //         state: item.state,
            //     }));
    
    
    
            //     var test = {
            //         ...values,
            //         name: values.name,
            //         customer_name: values.customer_name,
            //         project_manager_id: rootData,
            //         project_id:itemsData[0].project_id,
            //         project_sites: [...dynamicItems]
            //     }
    
    
                
            // }
            // else{
            //     var test = {
            //         ...values,
            //         project_id:id,
            //         project_sites: [
            //             {
            //                 id:values.id,
            //                 name: values.name,
            //                 address: values.address,
            //                 state: values.state,
            //             }
                       
            //         ]
            //     };
            // }
    



            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                };
                // console.log("values === ", values)
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
                const response = await axios.get(`${base_url}/api/admin/projects?project_id=${id}`,  {
                    headers: headers,
                });
                console.log(response.data.projects.project_manager.first_name, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
                const projectData = response.data.projects;
                console.log(projectData.name,'fffffffffffffffffff');
                form.setFieldsValue({
                    project_name:projectData.name,
                    number:projectData.project_no,
                    name:projectData.sites[0].name,
                    project_manager_id:response.data.projects.project_manager.id,
                    state:  projectData.sites[0].state,
                    address:projectData.sites[0].address, 
                    customer_name :projectData.customer_name    
                })
                // message.success(response.data.message)
                // setFormData(values.items);
    
                // router.push('/project')
            }
            catch (error) {
                console.log(error, 'catchhhhhhhhhhhhhhhhhhhh');
            }
    
            // console.log(values, 'hfurhgiurehg');
        }
        fetchProjectData();
    },[id])

    // const handleEditClick = (vendor) => {
    //     setSelectedVendor(vendor);
    // };

    const onFinish = async (values) => {
        if(values.items?.length>0){
            const dynamicItems = values.items.map(item => ({
                id:item.id,
                name: item.name,
                address: item.address,
                state: item.state,
            }));
            var data = {
                ...values,
                project_id:itemsData[0].project_id,
                name: values.name,
                customer_name: values.customer_name,
                project_manager_id: rootData,
                project_sites: [...dynamicItems]
            };
             console.log(data,'hhhhhhhhhhhhhhhhhhhhhhhhhhhh');
        }
        else{
            var data = {
                ...values,
                project_id:id,
                project_sites: [
                    {
                        id:values.id,
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
            };

            // Make a PUT request to update the vendor
           const response= await axios.patch(`${base_url}/api/admin/projects`, data, 
           {
             headers :headers,
             
        }
           );
           console.log(response,'vendor edit rsponse');

            // Display a success message
            message.success('Project updated successfully');
            router.push('/project')

            // Reset the selected vendor and refetch the updated list
            setSelectedVendor(null);
            // fetchRoles();
        } catch (error) {
            console.error('Error updating project:', error);
            // Display an error message
            message.error('Error updating project');
        }
    };

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
                        <li className="me-0 icon-text">
                            <i className="fa-solid fa-user me-3 mt-0"></i>
                            <span>Create New Project</span>
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
                                            name="number"
                                            // Add a name to link the input to the form values
                                            className="vender-input"
                                            rules={[{ required: true, message: 'Please enter your project number!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-4 col-md-12">
                                    <div className="selectwrap bg-border-select">
                                
                                        <Form.Item label="Project Maneger" name="project_manager_id"  className="vender-input">
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
                                                    <div className="wrap-box">
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

                                                    <div className="wrap-box">
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

                                                    <div className="wrap-box">
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
                                <div className="col-lg-4 col-md-12">
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
                                    <button type="submit" className="create-ven-butt">Update</button>
                                </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};
export { getServerSideProps }
export default Project_Edit;