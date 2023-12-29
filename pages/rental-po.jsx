import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import axios from 'axios';
import '../styles/style.css'
import { MinusOutlined, PlusOutlined, CaretDownFilled } from '@ant-design/icons';
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
    const [real_amount, setAmount] = useState(0);
    const [vendorForm, setVendorForm] = useState({
        company_name: '',
        email: '',
        phone: '',
        address: '',
        // address2:'',
        state: '',
        country: ''
    })


    const [items, setItems] = useState([]);


    const handleChange = ({ target: { name, value } }) => {
        setVendorForm({
            ...vendorForm,
            [name]: value
        })
    }
    const calculateAmount = (quantity, unitPrice) => quantity * unitPrice;
    const handleQuantityRepeaterChange = (value, index) => {
        const unitPrice = form.getFieldValue(['items', index, 'unit_price']) || 0;
        const test_amount = calculateAmount(value, unitPrice);
        form.setFields([{ name: ['items', index, 'amount'], value: test_amount }]);
    };

    const handleUnitPriceRepeaterChange = (value, index) => {
        const quantity = form.getFieldValue(['items', index, 'quantity']) || 0;
        const test_amount = calculateAmount(quantity, value);
        form.setFields([{ name: ['items', index, 'amount'], value: test_amount }]);
        const totalAmount = getTotalAmount();
        form.setFieldsValue({ HST_Amount: totalAmount * 0.13 });
        form.setFieldsValue({ Total_amount: totalAmount * 0.13 + totalAmount });
    };

    const getTotalAmount = () => {
        const repeaterLength = form.getFieldValue(['items']) ? form.getFieldValue(['items']).length : 0;
        let totalAmount = 0;

        for (let i = 0; i < repeaterLength; i++) {
            const quantity = form.getFieldValue(['items', i, 'quantity']) || 0;
            const unitPrice = form.getFieldValue(['items', i, 'unit_price']) || 0;
            const amount = calculateAmount(quantity, unitPrice);
            totalAmount += amount;
        }

        if (real_amount) {
            totalAmount = totalAmount + real_amount;
        }
        else {
            totalAmount = totalAmount
        }

        return totalAmount;
    };
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
        console.log(calculatedAmount, 'heree?????????????')

        setAmount(calculatedAmount);
        form.setFieldsValue({ Amount: calculatedAmount });
        form.setFieldsValue({ HST_Amount: calculatedAmount * 0.13 });
        form.setFieldsValue({ Total_amount: calculatedAmount * 0.13 + calculatedAmount });
    };
    const handlePoTypeChange = (value) => {
        console.log(value, 'valueeeeeeeeeeeeeeeeeeeeee');

        setshipmentType(value);
    };
    const onFinish = async (values) => {
        // if(values.items?.length>0){
        //     console.log(values.items,'valuessssssssssssssssss');
        //     const dynamicItems = values.items?.map(item => ({
        //         quantity: item.quantity,
        //         unit_price: item.unit_price,
        //         Amount: item.Amount,
        //         Description: item.Description
        //     }));
        //     var data = {
        //         po_data: {
        //             company_name: vendorForm.company_name,
        //             email: vendorForm.email,
        //             phone: vendorForm.phone,
        //             state: vendorForm.state,
        //             country: vendorForm.country,
        //             vendor_id: values.vendor_id,
        //             po_type: values.po_type,
        //             address1: vendorForm.address,
        //         },
        //         shipment: {
        //             HST_Amount: values.HST_Amount,
        //             Total_amount: values.Total_amount,
        //             shipment_type: values.shipment_type,
        //             project_id: values.project_id,
        //             shipment_address: 'add',
        //         },
        //         shipment_material: {
        //             quantity: values.quantity,
        //             unit_price: values.unit_price,
        //             Amount: values.Amount,
        //             Description: values.Description,
        //             material_for: values.materialFor,
        //             site_id: values.site_id,
        //             project_id: values.project_id,
        //             code: values.code,
        //             shipment_address: values.shipment_address,
        //             material_details:[...dynamicItems]
        //         }
    
        //     }
        // }
        // else{
        //     var data = {    
        //         po_data: {
        //             company_name: vendorForm.company_name,
        //             email: vendorForm.email,
        //             phone: vendorForm.phone,
        //             state: vendorForm.state,
        //             country: vendorForm.country,
        //             vendor_id: values.vendor_id,
        //             po_type: values.po_type,
        //             address1: vendorForm.address,
        //         },
        //         shipment: {
        //             HST_Amount: values.HST_Amount,
        //             Total_amount: values.Total_amount,
        //             shipment_type: values.shipment_type,
        //             project_id: values.project_id,
        //             shipment_address: 'add',
        //         },
        //         shipment_material: {
        //             quantity: values.quantity,
        //             unit_price: values.unit_price,
        //             Amount: values.Amount,
        //             Description: values.Description,
        //             material_for: values.materialFor,
        //             site_id: values.site_id,
        //             project_id: values.project_id,
        //             code: values.code,
        //             shipment_address: values.shipment_address,
        //             material_details:[{
        //                 quantity: values.quantity,
        //                 unit_price: values.unit_price,
        //                 Amount: values.Amount,
        //                 Description: values.Description
        //             }
        //             ]
        //         },
               
        //     }    
        // }
       
        // try {
        //     const headers = {
        //         Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     };
        //     console.log("values === ", values)
            
        //     const response = await axios.post(`${base_url}/api/admin/purchase-order`, data, {
        //         headers: headers,
        //     });
        //     console.log(response.data, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        //     // setShipmentAddress(response.data.shipment_address)
        //     if (response.data.status == true) {
        //         message.success(response.data.message)
        //         router.push('/po_list')
        //     }
        // }
        // catch (error) {
        //     console.log(error, 'catchhhhhhhhhhhhhhhhhhhh');
        // }
        // console.log("Received values:", values);
    };


    useEffect(() => {
        const fetchProjects = async () => {

            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/projects`, { headers: headers });
                setProjects(response.data.projects); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
            fetchProjects();
        }
    }, [shipmentType]);


    const fetchSites = async (projectId) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };

            const response = await axios.get(`${base_url}/api/admin/project-sites?project_id=${projectId}`, { headers });

            const sitesArray = response.data.sites;
            setSiteOptions(sitesArray);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    const list = (value) => {
        console.log(value, 'asssssssssssssssss');
        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
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
                            <li class="icon-text react-icon">
                                <PlusOutlined />
                                <span>Create New Purchase Order</span>
                            </li>
                        </ul>
                        {/* ... (your existing code) */}
                        <div className="choose-potype round-wrap">
                            <div className="inner-choose">
                                <Form onFinish={onFinish} form={form} className="file-form">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-12">
                                            <div className="selectwrap react-select">
                                                <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
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
                                                        >
                                                            <Option value="material">Material PO</Option>
                                                            <Option value="rental">Rental PO</Option>
                                                            <Option value="subcontractor">Sub Contractor PO</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="order-choose d-flex">
                                        <div className="left-wrap wrap-number">
                                            <Form.Item
                                                label="Purchase Order Number"
                                                name="poNumber"
                                                initialValue="00854"

                                            >
                                                <Input placeholder="00854" value='00584' readOnly />
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


                                    </div>
                                    <div class="linewrap d-flex" id="w-small">
                                        <span class="d-block me-0">To</span>
                                        <hr />
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-4 col-md-12">
                                            <div class="selectwrap react-select" id="vendor-selector">
                                                <div class="selectwrap  shipment-caret select-site aligned-text">
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
                                                            {names.map((entry) => (
                                                                <Select.Option key={entry.vendorId} value={entry.vendorId}>
                                                                    {entry.contactName}
                                                                </Select.Option>
                                                            ))}
                                                        </Select>

                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row space-raw  btm-space">
                                        <div class="col-lg-4 col-md-6 space-col-spc">
                                            <div class="wrap-box">
                                                <label>
                                                    Company Name
                                                </label>
                                                <input
                                                    label="Company Name"
                                                    for="name"
                                                    name="company_name"
                                                    type="text"
                                                    value={vendorForm.company_name}
                                                    onChange={handleChange}
                                                />
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
                                            <div class="selectwrap  shipment-caret aligned-text">
                                                <Form.Item
                                                    label="Shipment Type"
                                                    name="shipment_type"
                                                    for="file"
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
                                                <div class="selectwrap columns-select shipment-caret">
                                                    {/* / */}
                                                    <Form.Item
                                                        label="Project"
                                                        name="project_id"
                                                        for="file"
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
                                                <div class="selectwrap non-project-wrap">

                                                    <Form.Item
                                                        label="Delivery Address"
                                                        name="deliveryAddress"
                                                        for="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose Delivery Address",
                                                            },
                                                        ]}
                                                        initialValue='1860 Shawson'
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
                                                    for="name"
                                                    name="quantity"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter quantity",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Quantity" onChange={(e) => handleQuantityChange(e.target.value)} />
                                                </Form.Item>

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
                                                            message: "Please enter unit price",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Unit Price" onChange={(e) => handleUnitPriceChange(e.target.value)} />
                                                </Form.Item>

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
                                                            message: "Please enter amount",
                                                        },
                                                    ]}
                                                // onChange={}
                                                >
                                                    <Input placeholder="Amount" readOnly />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="row space-col-spc">
                                            {/* <div class="po-selected"> */}
                                            <div class="col-sm-4">
                                                <div className="wrap-box">
                                                    <Form.Item
                                                        label="Description"
                                                        for="name"
                                                        name="Description"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please enter description",
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Description" />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            {shipmentType === 'Project Related' && (
                                                <div class="col-sm-4">
                                                    <div className="selectwrap columns-select shipment-caret ">
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
                                                </div>
                                            )}
                                            {shipmentType === 'Non Project Related' && (
                                                <div class="col-sm-4 ">
                                                    <div className="selectwrap add-dropdown-wrap shipment-caret">
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
                                                </div>
                                            )}

                                            {shipmentType === 'Combined' && (
                                                <div className="col-md-4">
                                                    <div class="selectwrap add-dropdown-wrap">
                                                        <div class="selectwrap columns-select shipment-caret select-sites">
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
                                                    </div>
                                                </div>
                                            )}
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
                                                            <div class="selectwrap add-dropdown-wrap">
                                                                <div class="selectwrap columns-select shipment-caret ">
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

                                                            </div>
                                                        </>
                                                    )}


                                                    {materialFor === 'inventorys' && (
                                                        <>
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

                                                        </>

                                                    )}
                                                    {materialFor === 'expenses' && (<>
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

                                                    </>

                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="row select-sitee">

                                            <div className="col-md-4">
                                                {materialFor === 'projects' && (
                                                    <div class="selectwrap add-dropdown-wrap">
                                                        <div className="selectwrap columns-select shipment-caret ">
                                                            {/* <CaretDownFilled className="caret-icon" /> */}
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
                                        <div className="create-another minuswrap-img">

                                            <Form.List name="items" initialValue={[]}>
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                <div className="wrap-box">

                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'quantity']}
                                                                        fieldKey={[fieldKey, 'quantity']}
                                                                        label="Quantity"
                                                                        rules={[{ required: true, message: 'Please enter quantity' }]}
                                                                    >
                                                                        <Input
                                                                            placeholder="Quantity"
                                                                            onChange={(e) => handleQuantityRepeaterChange(e.target.value, index)}
                                                                        />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className="wrap-box">
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'unit_price']}
                                                                        fieldKey={[fieldKey, 'unit_price']}
                                                                        label="Unit Price"
                                                                        rules={[{ required: true, message: 'Please enter unit price' }]}
                                                                    >
                                                                        <Input
                                                                            placeholder="Unit Price"
                                                                            onChange={(e) => handleUnitPriceRepeaterChange(e.target.value, index)}
                                                                        />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className="wrap-box">

                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'amount']}
                                                                        fieldKey={[fieldKey, 'amount']}
                                                                        label="Amount"
                                                                        rules={[{ required: true, message: 'Amount is required' }]}
                                                                    >
                                                                        <Input placeholder="Amount" readOnly />
                                                                    </Form.Item>
                                                                </div>
                                                                <div className="wrap-box">
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'description']}
                                                                        fieldKey={[fieldKey, 'description']}
                                                                        label="Description"
                                                                        rules={[{ required: true, message: 'Please enter description' }]}
                                                                    >
                                                                        <Input placeholder="Description" />
                                                                    </Form.Item>
                                                                </div>
                                                                <MinusOutlined className="minus-wrap" onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                                Add More Material
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </div>
                                    </div>
                                    <div className="row top-btm-space">
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item

                                                    name='HST_Amount'
                                                    label="HST Amount"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="HST Amount" />
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
                                                    <Input placeholder="Total Amount" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-2">By Details</span>
                                        <hr />
                                    </div>
                                    <div className="row">
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item

                                                    name='first_name'
                                                    label="First Name"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="" />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item

                                                    name='last_name'
                                                    label="Last Name"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="" />
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
                </div>
            </div>
        </>
    );
};
export { getServerSideProps };
export default Create_po;