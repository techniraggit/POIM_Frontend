import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import axios from 'axios';
import '../styles/style.css'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
// import "antd/dist/antd.css";

const { Option } = Select;

const Create_po = ({ base_url }) => {
    const [shipmentType, setshipmentType] = useState(null);
    const [materialFor, setMaterialFor] = useState('');
    const defaultDate = moment();
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [vendors, setVendors] = useState([]);

    const handlePoTypeChange = (value) => {
        console.log(value, 'valueeeeeeeeeeeeeeeeeeeeee');

        setshipmentType(value);
    };
    const onFinish = async (values) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            console.log("values === ", values)
            const data = {
                // ...values,

                "po_data": {
                    email: values.email,
                    phone: values.phone,
                    state: values.state,
                    country: values.country,
                    vendor_id: values.vendor_id,
                    po_type: values.po_type,
                    address1: values.address1,
                    address2: values.address2
                },
                "shipment": {
                    HST_Amount: 6546,
                    Total_amount: 676867,
                    shipment_type: values.shipment_type,
                    project_id: values.project_id,
                    shipment_address: 'add'
                },
                "shipment_material": {
                    quantity: values.quantity,
                    unit_price: values.unit_price,
                    Amount: values.Amount,
                    Description: values.Description,
                    material_for: ' xzxcxbcv',
                    site_id: values.site_id,
                    project_id: values.project_id,
                    code: 45465,
                    shipment_address: 'sdsfdgd'
                }

            }
            // console.log(data,'hereeeee')
            // return
            const response = await axios.post(`${base_url}/api/admin/purchase-order`, data, {
                headers: headers,
            });
            console.log(response, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
            message.success(response.data.message)
            // router.push('/vendor')

            // console.log(response.data.message,'messssssssssssssssssssssssageeeeee');
            // console.log(response, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        }
        catch (error) {
            console.log(error, 'catchhhhhhhhhhhhhhhhhhhh');
        }


        // Handle form submission here
        console.log("Received values:", values);
    };


    useEffect(() => {
        const fetchProjects = async () => {

            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/projects`, { headers: headers });
                // console.log(response.data.projects, 'createporesssssssssssssssssssssssssssssssss');
                setProjects(response.data.projects); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (shipmentType === 'Project Related') {
            fetchProjects();
        }
    }, [shipmentType]);


    const fetchSites = async (projectId) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };

            const response = await axios.get(`${base_url}/api/admin/project-sites?project_id=${projectId}`,  { headers });
            console.log(response,'sitesssssssssssssssssssss');
            const sitesArray = response.data.sites;
            setSiteOptions(sitesArray);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    const list = (value) => {
        console.log(value, 'asssssssssssssssss');
        if (shipmentType === 'Project Related') {
            fetchSites(value);
        }
    };

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/vendors`, { headers: headers });
                console.log(response, 'vendorssssssssssssssssssssssss');
                setVendors(response.data.vendors); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchVendor();
    }, [])

    // const dsdsdsd=(value)=>{
    //     const fetchSites = async () => {

    //         try {
    //             const headers = {
    //                 Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
    //             }
    //             const response = await axios.get(`${base_url}/api/admin/project-sites?project_id=d3a379a6-5de7-4e47-8058-fbbba7ea93fc`, { headers: headers });
    //             console.log(response.data.sites, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    //             const sitesArray = response.data.sites;
    //             setSiteOptions(sitesArray);

    //         } catch (error) {
    //             console.error('Error fetching projects:', error);
    //         }
    //     };

    //     if (poType === 'Project Related') {
    //         fetchSites();
    //     }
    //   console.log(value,'asssssssssssssssss')
    // }

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Purchase Orders' />
                    <div className="bottom-wrapp">

                        <ul class=" create-icons">
                            <li class="icon-text react-icon">
                               <PlusOutlined />
                                <span>Create New Purchase Order</span>
                            </li>
                        </ul>
                        {/* ... (your existing code) */}
                        <div className="choose-potype round-wrap">
                            <div className="inner-choose">
                                <Form onFinish={onFinish} className="file-form">
                                    {/* ... (your existing code) */}
                                    <div className="row">
                                        <div className="col-lg-4 col-md-12">
                                            <div className="selectwrap react-select">
                                                <Form.Item
                                                    label="Choose PO Type"
                                                    name="po_type"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose PO Type",
                                                        },
                                                    ]}
                                                >
                                                    <Select placeholder="Select PO Type" id="single1"
                                                        class="js-states form-control file-wrap-select bold-select"
                                                    // onChange={handlePoTypeChange}
                                                    >
                                                        <Option value="Project Related">Material PO</Option>
                                                        <Option value="Non Project Related">Rental PO</Option>
                                                        <Option value="Combined">Sub Contractor PO</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ... (your existing code) */}
                                    <div class="order-choose d-flex">
                                        <div className="left-wrap wrap-number">
                                            <Form.Item
                                                label="Purchase Order Number"
                                                name="poNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please enter Purchase Order Number",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="00854" />
                                            </Form.Item>
                                        </div>


                                        <div className="left-wrap wrap-number" id="forspce">
                                            <Form.Item
                                                label="Date"
                                                name="poDate"
                                                initialValue={moment()} // Set initial value to the current date
                                                rules={[
                                                    {
                                                        validator: (_, value) => {
                                                            if (!value) {
                                                                return Promise.reject("Please enter Date");
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    style={{ width: "100%" }}
                                                    disabled // Disable user input
                                                    placeholder="18 Oct 2023"
                                                    suffixIcon={null}
                                                />
                                            </Form.Item>
                                        </div>

                                        {/* <div className="left-wrap" id="forspce">
                                            <Form.Item
                                                label="Date"
                                                name="date"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please enter Date",
                                                    },
                                                ]}
                                            >
                                                <DatePicker style={{ width: "100%" }} placeholder="18 Oct 2023" defaultValue={defaultDate} />
                                            </Form.Item>
                                        </div> */}
                                    </div>
                                    <div class="linewrap d-flex" id="w-small">
                                        <span class="d-block me-0">To</span>
                                        <hr />
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-4 col-md-12">
                                            <div class="selectwrap react-select">
                                                <Form.Item
                                                    label="Vendor"
                                                    name="vendor_id"
                                                    for="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose PO Type",
                                                        },
                                                    ]}
                                                >
                                                    <Select id="single2" class="js-states form-control file-wrap-select">
                                                        {Array.isArray(vendors) &&
                                                            vendors.map((vendor) => (
                                                                <Select.Option key={vendor.id} value={vendor.id}
                                                                >
                                                                    {/* {vendor.vendor_contact.map((vendor_contact, index) => (
                                                                        <Select.Option>{vendor_contact.name}</Select.Option>
                                                                        //  {vendor_contact.name}
                                                                        ))} */}
                                                                    {vendor.company_name}
                                                                </Select.Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row space-raw  btm-space">
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Company Name"
                                                    for="name"
                                                    name="company_name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Email</label>
                                                <input type="email"> */}
                                            </div>
                                        </div>
                                        {/* <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Company Name"
                                                    for="name"
                                                    name="companyName"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                ><br />
                                                    <Input placeholder="00854" />
                                                </Form.Item>


                                            </div>
                                        </div> */}
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Email"
                                                    for="name"
                                                    name="email"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Email</label>
                                                <input type="email"> */}
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Contact Number"
                                                    for="name"
                                                    name="phone"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input type="tel" placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Contact Number</label>
                                                <input type="tel"> */}
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Address Line 1"
                                                    for="name"
                                                    name="address1"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Address Line 1</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Address Line 2"
                                                    for="name"
                                                    name="address2"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Address Line 2</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="State / Province"
                                                    for="name"
                                                    name="state"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">State / Province</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Country"
                                                    for="name"
                                                    name="country"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Country</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>

                                    </div>
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Ship To</span>
                                        <hr />
                                    </div>
                                    <div class="row space-bottom">
                                        <div class="col-md-12  all-wrap-box">
                                            <div class="selectwrap react-select">
                                                <Form.Item
                                                    label="Shipment Type"
                                                    name="shipment_type"
                                                    for="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose PO Type",
                                                        },
                                                    ]}
                                                >
                                                    <Select id="single3" class="js-states form-control file-wrap-select"
                                                        onChange={handlePoTypeChange}
                                                    >
                                                        <Option value="Project Related">Project Related</Option>
                                                        <Option value="Non Project Related">Non Project Related</Option>
                                                        <Option value="Combined">Combined</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            {shipmentType === 'Project Related' && (
                                                <div class="selectwrap columns-select">
                                                    <Form.Item
                                                        label="Project"
                                                        name="project_id"
                                                        for="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose PO Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select id="single456"
                                                            class="js-states form-control file-wrap-select"
                                                            onChange={(value) => list(value)}

                                                        >
                                                            {Array.isArray(projects) &&
                                                                projects.map((project) => (
                                                                    <Select.Option key={project.id} value={project.id}
                                                                    // onChange={dsdsdsd(project.id)}
                                                                    >
                                                                        {project.name}
                                                                    </Select.Option>
                                                                ))}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            )}
                                            {shipmentType === 'Non Project Related' && (
                                                <div class="selectwrap columns-select">
                                                    <Form.Item
                                                        label="Delivery Address"
                                                        name="deliveryAddress"
                                                        for="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose PO Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select id="single78" class="js-states form-control file-wrap-select">
                                                            <Option value="Project Related">Project Related</Option>
                                                            <Option value="Non Project Related">Non Project Related</Option>
                                                            <Option value="Combined">Combined</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            )}
                                            {/* {poType === 'Combined' && (
                                                <div class="selectwrap">
                                                <Form.Item
                                                    label="Project"
                                                    name="project"
                                                    for="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose PO Type",
                                                        },
                                                    ]}
                                                >
                                                    <Select id="single21" class="js-states form-control file-wrap-select">
                                                        <Option value="Project Related">Project Related</Option>
                                                        <Option value="Non Project Related">Non Project Related</Option>
                                                        <Option value="Combined">Combined</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            )} */}
                                        </div>
                                    </div>
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Material</span>
                                        <hr />
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-4 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Quantity"
                                                    for="name"
                                                    name="quantity"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Quantity</label>
                                        <input type="text"> */}
                                            </div>
                                        </div>
                                        <div class="col-sm-4 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Unit Price"
                                                    for="name"
                                                    name="unit_price"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Unit Price</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>
                                        <div class="col-sm-4 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Amount"
                                                    for="name"
                                                    name="Amount"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Purchase Order Number",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" />
                                                </Form.Item>
                                                {/* <label for="name">Amount</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>
                                        <div class="col-sm-12 space-col-spc">
                                            <div class="wrap-box po-selected">
                                                <div class="col-sm-12">
                                                    <Form.Item
                                                        label="Description"
                                                        for="name"
                                                        name="Description"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please enter Purchase Order Number",
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="00854" />
                                                    </Form.Item>
                                                </div>

                                                {shipmentType === 'Project Related' && (
                                                    <div class="col-sm-6 selectwrap">
                                                        <Form.Item
                                                            label="Select Site"
                                                            name="site_id"
                                                            for="file"
                                                            class="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please choose PO Type",
                                                                },
                                                            ]}
                                                        >
                                                            <Select id="single51" class="js-states form-control file-wrap-select">
                                                                {Array.isArray(siteOptions) &&
                                                                    siteOptions.map((site) => (
                                                                        <Select.Option key={site.id} value={site.id}>
                                                                            {site.name}
                                                                        </Select.Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                )}
                                                {shipmentType === 'Non Project Related' && (


                                                    <div class="col-sm-6 selectwrap">
                                                        <Form.Item
                                                            label="Material For"
                                                            name="materialFor"
                                                            for="file"
                                                            class="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please choose Material For",
                                                                },
                                                            ]}
                                                        >
                                                            <Select id="single90"
                                                                class="js-states form-control file-wrap-select"
                                                                onChange={(value) => setMaterialFor(value)}
                                                            >
                                                                <Option value="inventory">Inventory</Option>
                                                                <Option value="supplies">Supplies/Expenses</Option>
                                                                {/* <Option value="Combined">Combined</Option> */}
                                                            </Select>
                                                        </Form.Item>

                                                        {materialFor === 'inventory' && (
                                                            <Form.Item
                                                                label="Inventory Code"
                                                                name="inventoryCode"
                                                                htmlFor="file"
                                                                className="same-clr"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Please enter Inventory Code",
                                                                    },
                                                                ]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        )}
                                                        {materialFor === 'supplies' && (
                                                            <Form.Item
                                                                label="GL Code"
                                                                name="glCode"
                                                                htmlFor="file"
                                                                className="same-clr"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Please enter GL Code",
                                                                    },
                                                                ]}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        )}
                                                    </div>
                                                )}

                                                {shipmentType === 'Combined' && (
                                                    <div class="selectwrap">
                                                        <Form.Item
                                                            label="Material For"
                                                            name="material"
                                                            for="file"
                                                            class="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please choose PO Type",
                                                                },
                                                            ]}
                                                        >
                                                            <Select id="single67" class="js-states form-control file-wrap-select">
                                                                <Option value="Project Related">Project </Option>
                                                                <Option value="Non Project Related">Inventory</Option>
                                                                <Option value="Combined">Supplies/Expenses</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                )}

                                                {/* <label for="name">Description</label>
                                                <input type="text"> */}
                                            </div>
                                        </div>








                                        <Form.List name="items">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'itemQuantity']}
                                                                fieldKey={[fieldKey, 'itemQuantity']}
                                                                label="Quantity"
                                                                rules={[{ required: true, message: 'Please enter name' }]}
                                                            >
                                                                <Input placeholder="quantity" />
                                                            </Form.Item>

                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'itemUnitPrice']}
                                                                fieldKey={[fieldKey, 'itemUnitPrice']}
                                                                label="Unit Price"
                                                                rules={[{ required: true, message: 'Please enter email' }]}
                                                            >
                                                                <Input placeholder="unit price" />
                                                            </Form.Item>

                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'itemAmount']}
                                                                fieldKey={[fieldKey, 'itemAmount']}
                                                                label="Amount"
                                                                rules={[{ required: true, message: 'Please enter phone number' }]}
                                                            >
                                                                <Input placeholder="amount" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'itemDescription']}
                                                                fieldKey={[fieldKey, 'itemDescription']}
                                                                label="Description"
                                                                rules={[{ required: true, message: 'Please enter phone number' }]}
                                                            >
                                                                <Input placeholder="description" />
                                                            </Form.Item>

                                                            <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="dashed" className="add-more-btn" onClick={() => add()} icon={<PlusOutlined />}>
                                                            <span >Add Another Contact Person</span>
                                                        </Button>
                                                    </Form.Item>


                                                </>
                                            )}
                                        </Form.List>






                                        {/* <div class="col-md-12">
                                            <button class="butt-flex"><i class="fa-solid fa-plus"></i>
                                                <span class="add-para">Add Another Contact Person</span>
                                            </button>
                                        </div> */}
                                    </div>
                                    {/* ... (continue adapting your existing code) */}
                                    <div className="po-wrap">
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="create-ven-butt">
                                                Create PO
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export { getServerSideProps };
export default Create_po;
