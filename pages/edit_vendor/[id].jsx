import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Space, } from 'antd';
import { EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons';
import axios from 'axios';
import Link from "next/link";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import DynamicTitle from '@/components/dynamic-title.jsx';

const Vendor_Edit = ({ base_url }) => {
    const [form] = Form.useForm();
   
    const router = useRouter();
    const { id } = router.query;
    const [vendors, setVendors] = useState([]);
    const [totalVendor, setTotalVendor] = useState(0);
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                };
                const response = await axios.get(`${base_url}/api/admin/vendors?vendor_id=${id}`, { headers });
                console.log(response.data,'get vendor api respone');
                setTotalVendor(response.data.total_vendors);
                setVendors(response.data.vendors);


                const vendorData = response.data.vendors_details;
                console.log(vendorData,'$$$$$$$$$$$$$$$$$');
                form.setFieldsValue({
                company_name:vendorData.company_name,
                name:vendorData.vendor_contact[0].name,
                phone_number:vendorData.vendor_contact[0].phone_number,
                email:vendorData.vendor_contact[0].email,
                address:vendorData.address

                })
                
            //    vendorData.map((data)=>{
            //     console.log(data.company_name,'#################');
            //     form.setFieldValue({
            //         company_name:data.company_name,
            //     })
            //    })
                console.log(vendorData,'!!!!!!!!!!!!!!!!!!!!!!!S');
               

            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };
        fetchRoles();
    }, []);

    // const handleEditClick = (vendor) => {
    //     setSelectedVendor(vendor);
    // };

    const onFinish = async (values) => {
        if(values.items?.length>0){
            const dynamicItems = values.items.map(item => ({
                id:item.id,
                name: item.name,
                phone_number: item.phone_number,
                email: item.email,
            }));
            var data = {
                ...values,
                vendor_id:itemsData[0].vendor_id,
                contact_info: [...dynamicItems]
            };
             console.log(data,'hhhhhhhhhhhhhhhhhhhhhhhhhhhh');
        }
        else{
            var data = {
                ...values,
                vendor_id:id,
                contact_info: [
                    {
                        id:values.id,
                        name: values.name,
                        phone_number: values.phone_number,
                        email: values.email,
                    }                   
                ]
            };
        }




        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };

            // Make a PUT request to update the vendor
           const response= await axios.patch(`${base_url}/api/admin/vendors`, data, 
           {
             headers :headers,
             
        }
           );
           console.log(response,'vendor edit rsponse');

            // Display a success message
            message.success('Vendor updated successfully');
            // router.push('/vendor')

            // Reset the selected vendor and refetch the updated list
            setSelectedVendor(null);
            // fetchRoles();
        } catch (error) {
            console.error('Error updating vendor:', error);
            // Display an error message
            message.error('Error updating vendor');
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
                                        <button type="submit" className="create-ven-butt">Update</button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export { getServerSideProps }
export default Vendor_Edit;
