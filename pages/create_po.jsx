import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import axios from 'axios';
import '../styles/style.css'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/router';
// import "antd/dist/antd.css";

const { Option } = Select;

const Create_po = ({ base_url }) => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [shipmentType, setshipmentType] = useState(null);
    const [materialFor, setMaterialFor] = useState('');
    const defaultDate = moment();
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendorId, setVendorId] = useState('');

    const [quantity, setQuantity] = useState(0);
    const [unitPrice, setUnitPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    const [vendorForm, setVendorForm] = useState({
        company_name: '',
        email: '',
        phone: '',
        address: '',
        // address2:'',
        state: '',
        country: ''
    })
    const handleChange = ({ target: { name, value } }) => {
        setVendorForm({
            ...vendorForm,
            [name]: value
        })
    }
    // const [shipmentAddress, setShipmentAddress] = useState('1860 Shawson')

    const handleQuantityChange = (value) => {
        setQuantity(value);
        updateAmount(value, unitPrice);
    };

    const handleUnitPriceChange = (value) => {
        setUnitPrice(value);
        updateAmount(quantity, value);
    };

    const updateAmount = (quantity, unitPrice) => {
        const calculatedAmount = quantity * unitPrice;
        setAmount(calculatedAmount);
        form.setFieldsValue({ Amount: calculatedAmount });
    };

    const handlePoTypeChange = (value) => {
        console.log(value, 'valueeeeeeeeeeeeeeeeeeeeee');

        setshipmentType(value);
    };
    const onFinish = async (values) => {
        const dynamicItems = values.items?.map(item => ({
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.Amount,
            description: item.Description
        }));
        console.log(dynamicItems, 'dynamicccccccccccccc================');
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            console.log("values === ", values.items)
            const data = {
                //...values,

                po_data: {
                    company_name: vendorForm.company_name,
                    email: vendorForm.email,
                    phone: vendorForm.phone,
                    state: vendorForm.state,
                    country: vendorForm.country,
                    vendor_id: values.vendor_id,
                    po_type: values.po_type,
                    address1: vendorForm.address,
                },
                shipment: {
                    HST_Amount: values.HST_Amount,
                    Total_amount: values.Total_amount,
                    shipment_type: values.shipment_type,
                    project_id: values.project_id,
                    shipment_address: 'add'
                },
                shipment_material: {
                    quantity: values.quantity,
                    unit_price: values.unit_price,
                    Amount: values.Amount,
                    Description: values.Description,
                    material_for: values.materialFor,
                    site_id: values.site_id,
                    project_id: values.project_id,
                    code: values.code,
                    shipment_address: values.shipment_address
                }

            }
            // console.log(data,  values, 'hereeeee')
            // return
            const response = await axios.post(`${base_url}/api/admin/purchase-order`, data, {
                headers: headers,
            });
            console.log(response.data, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
            // setShipmentAddress(response.data.shipment_address)
            if (response.data.status == true) {
                message.success(response.data.message)
                router.push('/po_list')
            }


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

            const response = await axios.get(`${base_url}/api/admin/project-sites?project_id=${projectId}`, { headers });
            console.log(response, 'vendorssssss>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
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
                console.log(response.data.vendors, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                setVendors(response.data.vendors);
                // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        // if(vendorId){
        fetchVendor();

        // }
    }, [])



    useEffect(() => {
        const vendorDetails = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/vendors?vendor_id=${vendorId}`, { headers: headers });


                // setVendors(response.data.vendors); 
                console.log(vendorId)
                if (vendorId && response?.data?.status) {
                    console.log({
                        ...vendorForm,
                        company_name: response.data.vendors_details.company_name,
                        email: response.data.vendors_details.vendor_contact[0].email,
                        phone: response.data.vendors_details.vendor_contact[0].phone_number,
                        address: response.data.vendors_details.address,
                        state: response.data.vendors_details.state,
                        country: response.data.vendors_details.country
                    }, "=======data");

                    setVendorForm({
                        ...vendorForm,
                        company_name: response.data.vendors_details.company_name,
                        email: response.data.vendors_details.vendor_contact[0].email,
                        phone: response.data.vendors_details.vendor_contact[0].phone_number,
                        address: response.data.vendors_details.address,
                        state: response.data.vendors_details.state,
                        country: response.data.vendors_details.country
                    })
                }

            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        if (vendorId) {
            vendorDetails();

        }
    }, [vendorId])

    console.log(vendorForm, '3333333333333333333333333');





    const names = vendors?.map((vendor) => {
        return {
            vendorId: vendor.id,
            contactName: vendor.vendor_contact[0].name
        };
    });

    const handleVendorChange = (value) => {
        setVendorId(value)
        console.log(value, 'vendoriddddddddddddddddd=================');
    }


    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Purchase Orders' />
                    <div className="bottom-wrapp">

                        <ul class=" create-icons">
                            <li class="icon-text">
                                <i class="fa-solid fa-plus me-3 mt-0"></i>
                                <span>Create New Purchase Order</span>
                            </li>
                        </ul>
                        {/* ... (your existing code) */}
                        <div className="choose-potype">
                            <div className="inner-choose">
                                <Form form={form} onFinish={onFinish} className="file-form">
                                    {/* ... (your existing code) */}
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="selectwrap">
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
                                                        <Option value="material">Material PO</Option>
                                                        <Option value="rental">Rental PO</Option>
                                                        <Option value="subcontractor">Sub Contractor PO</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    {/* ... (your existing code) */}
                                    <div class="order-choose d-flex">
                                        <div className="left-wrap">
                                            <Form.Item
                                                label="Purchase Order Number"
                                                name="poNumber"
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: "Please enter Purchase Order Number",
                                                //     },
                                                // ]}
                                                initialValue="00854"
                                            >
                                                <Input readOnly />
                                            </Form.Item>
                                        </div>


                                        <div className="left-wrap" id="forspce">
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
                                        <div class="col-md-4">
                                            <div class="selectwrap">
                                                <Form.Item
                                                    label="Vendor"
                                                    name="vendor_id"
                                                    for="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose Vendor",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        id="single2"
                                                        className="js-states form-control file-wrap-select"
                                                        onChange={(value) => handleVendorChange(value)}
                                                    >
                                                        {names?.map((entry) => (
                                                            <Select.Option key={entry.vendorId} value={entry.vendorId}>
                                                                {entry.contactName}
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
                                                {/* <Form.Item
                                                    label="Company Name"
                                                    for="name"
                                                    name="company_name"
                                                    // value={vendorForm.company_name}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter company name",
                                                        },
                                                    ]}
                                                    onChange={handleChange}
                                                >
                                                    <Input placeholder="00854" value={vendorForm.company_name} />
                                                </Form.Item> */}
                                                <label>
                                                    Company Name
                                                </label>
                                                <input
                                                    label="Company Name"
                                                    for="name"
                                                    name="company_name"
                                                    type="text"
                                                    value={vendorForm.company_name}
                                                    // rules={[
                                                    //     {
                                                    //         required: true,
                                                    //         message: "Please enter Company name",
                                                    //     },
                                                    // ]}
                                                    onChange={handleChange}
                                                // onChange=handleChange={}
                                                />
                                                {/* <Input value={vendorForm.company_name} placeholder="00854" /> */}
                                                {/* </input> */}
                                                {/* <label for="name">Email</label>
                                                <input type="email"> */}
                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <label>
                                                    Email
                                                </label>
                                                <input
                                                    for="name"
                                                    name="email"
                                                    type="text"
                                                    value={vendorForm.email}

                                                    onChange={handleChange}
                                                />

                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <label>Contact Number</label>
                                                <input
                                                    for="name"
                                                    name="phone"
                                                    type="text"
                                                    value={vendorForm.phone}

                                                    onChange={handleChange}
                                                />


                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <label>Address</label>
                                                <input
                                                    for="name"
                                                    name="address"
                                                    type="text"
                                                    value={vendorForm.address}

                                                    onChange={handleChange}
                                                />


                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <label>State / Province</label>
                                                <input
                                                    for="name"
                                                    name="state"
                                                    type="text"
                                                    value={vendorForm.state}

                                                    onChange={handleChange}
                                                />


                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <label>Country</label>
                                                <input
                                                    for="name"
                                                    name="country"
                                                    type="text"
                                                    value={vendorForm.country}

                                                    onChange={handleChange}
                                                />


                                            </div>
                                        </div>

                                    </div>
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Ship To</span>
                                        <hr />
                                    </div>
                                    <div class="row space-bottom">
                                        <div class="col-md-12  all-wrap-box">
                                            <div class="selectwrap">
                                                <Form.Item
                                                    label="Shipment Type"
                                                    name="shipment_type"
                                                    htmlFor="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Choose Shipment Type",
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
                                                        htmlFor="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose Project",
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
                                                        name="shipment_address"
                                                        htmlFor="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose Delivery Address",
                                                            },
                                                        ]}
                                                        initialValue="1860 Shawson"

                                                    >
                                                        <Input readOnly />

                                                    </Form.Item>
                                                </div>
                                            )}

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
                                                    htmlFor="name"
                                                    name="quantity"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter quantity",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" onChange={(e) => handleQuantityChange(e.target.value)} />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="col-sm-4 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Unit Price"
                                                    htmlFor="name"
                                                    name="unit_price"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter unit price",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" onChange={(e) => handleUnitPriceChange(e.target.value)} />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="col-sm-4 space-col-spc">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Amount"
                                                    htmlFor="name"
                                                    name="Amount"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter amount",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="00854" value={amount} readOnly />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="wrap-box">
                                                    <Form.Item
                                                        label="Description"
                                                        htmlFor="name"
                                                        name="Description"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please enter description",
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="00854" />
                                                    </Form.Item>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="wrap-box">
                                                    {shipmentType === 'Project Related' && (
                                                        <div class="col-sm-4 selectwrap">
                                                            <Form.Item
                                                                label="Select Site"
                                                                name="site_id"
                                                                htmlFor="file"
                                                                class="same-clr"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Please choose site",
                                                                    },
                                                                ]}
                                                            >
                                                                <Select id="singlesa" class="js-states form-control file-wrap-select">
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


                                                        <div class="col-sm-4 selectwrap">
                                                            <Form.Item
                                                                label="Material For"
                                                                name="materialFor"
                                                                htmlFor="file"
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

                                                                </Select>
                                                            </Form.Item>
                                                        </div>
                                                    )}

                                                    {shipmentType === 'Combined' && (
                                                        <div class="selectwrap">
                                                            <Form.Item
                                                                label="Material For"
                                                                name="materialFor"
                                                                htmlFor="file"
                                                                class="same-clr"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Please choose material",
                                                                    },
                                                                ]}
                                                            >
                                                                <Select id="single67" class="js-states form-control file-wrap-select"
                                                                    onChange={(value) => setMaterialFor(value)}
                                                                >
                                                                    <Option value="projects">Project </Option>
                                                                    <Option value="inventorys">Inventory</Option>
                                                                    <Option value="expenses">Supplies/Expenses</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </div>



                                                    )}


                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="wrap-box">
                                                    {materialFor === 'inventory' && (
                                                        <Form.Item
                                                            label="Inventory Code"
                                                            name="code"
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
                                                            name="code"
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

                                                    {materialFor === 'projects' && (
                                                        <>
                                                            <div class="selectwrap columns-select">
                                                                <Form.Item
                                                                    label="Project"
                                                                    name="project_id"
                                                                    htmlFor="file"
                                                                    class="same-clr"
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Please choose Project",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Select id="single406"
                                                                        class="js-states form-control file-wrap-select"
                                                                        onChange={(value) => list(value)}

                                                                    >
                                                                        {Array.isArray(projects) &&
                                                                            projects.map((project) => (
                                                                                <Select.Option key={project.id} value={project.id}

                                                                                >
                                                                                    {project.name}
                                                                                </Select.Option>
                                                                            ))}
                                                                    </Select>
                                                                </Form.Item>

                                                            </div>
                                                        </>
                                                    )}


                                                    {materialFor === 'inventorys' && (
                                                        <>
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

                                                        </>

                                                    )}
                                                    {materialFor === 'expenses' && (
                                                        <>
                                                            <Form.Item
                                                                label="GL Code"
                                                                name="glCode"
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

                                                        </>

                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="row select-sitee">

                                            <div className="col-md-4">
                                                {materialFor === 'projects' && (
                                                    <div class="selectwrap columns-select">
                                                        <Form.Item
                                                            label="Select Site"
                                                            name="site_id"
                                                            htmlFor="file"
                                                            class="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please choose site",
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
                                                {materialFor === 'inventorys' && (
                                                    <div class="wrap-box">
                                                        < Form.Item
                                                            label="Delivery Address"
                                                            name="delivery"
                                                            htmlFor="file"
                                                            className="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter Inventory Code",
                                                                },
                                                            ]}
                                                            initialValue="1860 Shawson"
                                                        >
                                                            <Input readOnly />

                                                        </Form.Item>
                                                    </div>
                                                )}
                                                {materialFor === 'expenses' && (
                                                    <>
                                                        <div class="wrap-box">
                                                            < Form.Item
                                                                label="Delivery Address"
                                                                name="delivery"
                                                                htmlFor="file"
                                                                className="same-clr"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Please enter Inventory Code",
                                                                    },
                                                                ]}
                                                                initialValue="1860 Shawson"
                                                            >
                                                                <Input readOnly />

                                                            </Form.Item>
                                                        </div>
                                                    </>

                                                )}

                                            </div>
                                        </div>


                                        {/* <div> */}
                                        <Form.List name="items">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'quantity']}
                                                                fieldKey={[fieldKey, 'quantity']}
                                                                label="Quantity"
                                                                rules={[{ required: true, message: 'Please enter name' }]}
                                                            >
                                                                <Input placeholder="quantity" />
                                                            </Form.Item>

                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'unit_price']}
                                                                fieldKey={[fieldKey, 'unit_price']}
                                                                label="Unit Price"
                                                                rules={[{ required: true, message: 'Please enter email' }]}
                                                            >
                                                                <Input placeholder="unit price" />
                                                            </Form.Item>

                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'Amount']}
                                                                fieldKey={[fieldKey, 'Amount']}
                                                                label="Amount"
                                                                rules={[{ required: true, message: 'Please enter phone number' }]}
                                                            >
                                                                <Input placeholder="amount" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'Description']}
                                                                fieldKey={[fieldKey, 'Description']}
                                                                label="Description"
                                                                rules={[{ required: true, message: 'Please enter phone number' }]}
                                                            >
                                                                <Input placeholder="description" />
                                                            </Form.Item>

                                                            <MinusCircleOutlined onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="dashed" className="top-btn-space" onClick={() => add()} icon={<PlusOutlined />}>
                                                            <span >Add More Material</span>
                                                        </Button>
                                                    </Form.Item>


                                                </>
                                            )}
                                        </Form.List>

                                    </div>

                                    <div className="row">
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item

                                                    name='HST_Amount'
                                                    label="HST Amount"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="description" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item

                                                    name='Total_amount'
                                                    label="Total Amount"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="description" />
                                                </Form.Item>
                                            </div>
                                        </div>

                                    </div>
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
                </div >
            </div >
        </>
    );
};
export { getServerSideProps };
export default Create_po;
