'use client'
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
import '../styles/style.css'
import { MinusOutlined, PlusOutlined, CaretDownFilled } from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useGlobalContext } from "@/app/Context/UserContext";

const { Option } = Select;
const repeatorData = {
    quantity: '',
    unit_price: 0,
    amount: 0,
    description: '',
    materialFor: '',
    code: '',
    project: '',
    site: ''
}
const Material = ({ base_url }) => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [shipmentType, setshipmentType] = useState(null);
    const [materialFor, setMaterialFor] = useState('');
    const defaultDate = moment();
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    // const[contactOptions,setContactOptions]=useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendorId, setVendorId] = useState('');


    const [contacts, setContacts] = useState([]);
    const [contactId, setContactId] = useState('');

    const [repeator, setRepeator] = useState([]);
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

    const { user } = useGlobalContext();


    const [items, setItems] = useState([]);


    const handleChange = ({ target: { name, value } }) => {
        setVendorForm({
            ...vendorForm,
            [name]: value
        })
    }
    const handleAddMaterial = () => {
        // Add a new item to the state
        setItems([...items, { quantity: 0, unit_price: 0, amount: 0, description: '' }]);
    };

    const calculateAmount = (quantity, unitPrice) => quantity * unitPrice;

    const handleQuantityRepeaterChange = (value, index) => {
        const unitPrice = form.getFieldValue(['items', index, 'unit_price']) || 0;
        const test_amount = calculateAmount(value, unitPrice);
        form.setFields([{ name: ['items', index, 'amount'], value: test_amount }]);
    };

    const handleUnitPriceRepeaterChange = () => {
        const totalAmount = getTotalAmount();
        form.setFieldsValue({ HST_Amount: totalAmount * 0.13 });
        form.setFieldsValue({ Total_amount: totalAmount * 0.13 + totalAmount });
    };

    const getTotalAmount = () => {
        const repeaterLength = form.getFieldValue(['items']) ? form.getFieldValue(['items']).length : 0;
        let totalAmount = 0;

        for (let i = 0; i < repeaterLength; i++) {
            const quantity = repeator[i].quantity || 0;
            const unitPrice = repeator[i].unit_price || 0;
            const amount = calculateAmount(quantity, unitPrice);
            totalAmount += amount;
        }

        if (real_amount) {
            totalAmount = totalAmount + real_amount;
        } else {
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

        setAmount(calculatedAmount);
        form.setFieldsValue({ Amount: calculatedAmount });
        form.setFieldsValue({ HST_Amount: calculatedAmount * 0.13 });
        form.setFieldsValue({ Total_amount: calculatedAmount * 0.13 + calculatedAmount });
    };



    const handlePoTypeChange = (value) => {
        setshipmentType(value);
    };

    const onFinish = async (values) => {
        if (values.items?.length > 0) {
            const dynamicItems = repeator?.map((item) => ({
                quantity: item.quantity,
                unit_price: item.unit_price,
                amount: item.amount,
                description: item.description,
                material_for: values.materialFor,
                code: values.code,
                project_id: values.project,
                project_site_id: values.site,
            }));
            var data = {
                // -------------------------------------------------------------------
                po_type: values.po_type,
                // vendor_id: values.vendor_id,
                amount: values.Amount,
                vendor_contact_id: values.vendor_contact_id,
                shipment_type: values.shipment_type,
                hst_amount: values.HST_Amount,
                total_amount: values.Total_amount,
                project_site_id: values.site_id,
                material_details: [...dynamicItems],

            }
        } else {
            var data = {
                po_type: values.po_type,
                // vendor_id: values.vendor_id,
                vendor_contact_id: values.vendor_contact_id,
                shipment_type: values.shipment_type,
                hst_amount: values.HST_Amount,
                total_amount: values.Total_amount,
                project_site_id: values.site_id,
                amount: values.Amount,
                material_details: [{
                    quantity: values.quantity,
                    unit_price: values.unit_price,
                    amount: values.amount,
                    description: values.Description,
                    material_for: values.materialFor,
                    code: values.code,
                    project_id: values.project_id,
                    project_site_id: values.site_id,
                }]


            }
        }

        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            const response = await axios.post(`${base_url}/api/admin/purchase-order`, data, {
                headers: headers,
            });
            // setShipmentAddress(response.data.shipment_address)
            if (response.data.status == true) {
                message.success(response.data.message)
                router.push('/po_list')
            }
        }
        catch (error) {
        }
    };


    useEffect(() => {
        const fetchProjects = async () => {

            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/helping/get-projects-list`, { headers: headers });
                console.log(response,'sssssssssssssssssssssss');

                setProjects(response.data.projects); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
            fetchProjects();
        }
    }, [shipmentType]);


    useEffect(() => {
        const fetchVendorContact = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/helping/vendors-and-contacts`, { headers: headers });
                setVendors(response.data.vendors);
                // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        // if(vendorId){
        fetchVendorContact();

        // }
    }, [])


    const fetchVendorContactDropdown = async (id) => {
        try {
            const headers = {
                Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
            }
            const response = await axios.get(`${base_url}/api/helping/vendors-and-contacts?vendor_id=${id}`, { headers: headers });
            setContactId(response.data.vendors)
            // setVendors(response.data.vendors);
            // Assuming the API response is an array of projects
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const fetchSites = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };

            const response = await axios.get(`${base_url}/api/admin/project-sites`, { headers });

            const sitesArray = response.data.sites;
            setSiteOptions(sitesArray);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const list = (value) => {
        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
            fetchSites(value);
        }
    };

    // useEffect(() => {
    const vendorContactDetails = async (id) => {
        try {
            const headers = {
                Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
            }
            const response = await axios.get(`${base_url}/api/helping/vendor-details?vendor_contact_id=${id}`, { headers: headers });

            setContacts(response.data.vendors);


            setVendorForm({
                ...vendorForm,
                company_name: response.data.vendors.company.company_name,
                email: response.data.vendors.email,
                phone: response.data.vendors.phone_number,
                address: response.data.vendors.company.address,
                state: response.data.vendors.company.state,
                country: response.data.vendors.company.country
            })
            // }

        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const names = vendors?.map((vendor) => {
        return {
            vendorId: vendor.vendor_id,
            company_name: vendor.company_name,
        };
    });

    const handleRepeatorChange = (value, name, index) => {
        const values = repeator[index];
        if (values) {
            repeator[index] = {
                ...repeator[index],
                [name]: value
            }

            if (repeator[index].quantity && repeator[index].unit_price) {
                repeator[index] = {
                    ...repeator[index],
                    amount: parseFloat(repeator[index].quantity) * parseFloat(repeator[index].unit_price)
                }
            }
        }
        if (name === 'unit_price' || name === 'quantity') {
            handleUnitPriceRepeaterChange();
        }
        setRepeator([...repeator]);
    }

    return (
        <>

            <Form onFinish={onFinish} form={form} className="file-form">
                {/* ... (your existing code) */}
                <div className="row po-typeraw">
                    <div className="col-lg-4 col-md-6">
                        <div className="selectwrap react-select">
                            <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                {/* <CaretDownFilled className="caret-icon" /> */}
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
                </div>
                {/* ... (your existing code) */}
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
                <div class="row vendor-rowgap">
                    <div class="col-lg-4 col-md-6">
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
                                        placeholder="Select"
                                        className="js-states form-control file-wrap-select"
                                        onChange={(value) => fetchVendorContactDropdown(value)}
                                    >
                                        {names.map((entry) =>
                                        (
                                            <Select.Option key={entry.vendorId} value={entry.vendorId}>
                                                {entry.company_name}
                                            </Select.Option>
                                        )
                                        )}
                                    </Select>

                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="selectwrap react-select" id="vendor-selector">
                            <div class="selectwrap  shipment-caret select-site aligned-text">

                                <Form.Item
                                    label="Vendor Contact Person"
                                    name="vendor_contact_id"
                                    htmlFor="file"
                                    class="same-clr"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please choose site",
                                        },
                                    ]}
                                >
                                    <Select
                                        id="singlesa"
                                        placeholder="Select"
                                        class="js-states form-control file-wrap-select"
                                        onChange={(value) => vendorContactDetails(value)}
                                    >
                                        {contactId.length > 0 &&
                                            contactId.map((contact) => (
                                                <Select.Option key={contact.vendor_contact_id} value={contact.vendor_contact_id}>
                                                    {contact.name}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>

                                </Form.Item>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="row space-raw  btm-space">
                    <div class="col-lg-4 col-md-6">
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

                    <div class="col-lg-4 col-md-6">
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
                    <div class="col-lg-4 col-md-6">
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
                    <div class="col-lg-4 col-md-6">
                        <div class="wrap-box mb-0">
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

                    <div class="col-lg-4 col-md-6">
                        <div class="wrap-box mb-0">
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
                        <div class="wrap-box mb-0">
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
                <div class="row space-bottom mb-0">
                    <div class="col-md-6 col-lg-12 all-wrap-box">
                        <div class="selectwrap  shipment-caret aligned-text">
                            {/* <CaretDownFilled className="caret-icon" /> */}

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
                                <Select id="single3" placeholder="Select" class="js-states form-control file-wrap-select"
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
                                {/* <CaretDownFilled className="caret-icon" /> */}

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
                                                <Select.Option key={project.project_id} value={project.project_id}
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
                    <div class="row space-col-spc mb-0">
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
                        {/* </div> */}

                        {/* <div className="col-md-4"> */}
                        {/* <div className="wrap-box"> */}
                        {shipmentType === 'Project Related' && (
                            <div class="col-sm-4">
                                <div className="selectwrap columns-select shipment-caret ">
                                    
                                    {/* <CaretDownFilled className="caret-icon" /> */}

                                    {/* /// */}
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
                                                    <Select.Option key={site.site_id} value={site.site_id}>
                                                        {site.name}
                                                    </Select.Option>
                                                )
                                                )}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                        )}
                        {shipmentType === 'Non Project Related' && (
                            <div class="col-sm-4 ">
                                <div className="selectwrap add-dropdown-wrap shipment-caret">
                                    
                                    {/* <CaretDownFilled className="caret-icon" /> */}
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
                                                <Option value="project">Project </Option>
                                                <Option value="inventory">Inventory</Option>
                                                <Option value="supplies">Supplies/Expenses</Option>
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* </div> */}
                        {/* </div> */}
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

                                {materialFor === 'project' && (
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
                                                                <Select.Option key={project.project_id} value={project.project_id}

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
                                {/* {materialFor === 'inventorys' && (
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

                                )} */}

                            </div>
                        </div>
                    </div>

                    <div className="row select-sitee">

                        <div className="col-md-4">
                            {materialFor === 'project' && (
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
                                                        <Select.Option key={site.site_id} value={site.site_id}>
                                                            {site.name}
                                                        </Select.Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                            )}
                            {/* {materialFor === 'inventorys' && (
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
                            )} */}

                        </div>
                    </div>
                    {/* <div> */}
                    <div className="create-another minuswrap-img">
                        {/* {shipmentType === 'Non Project Related' && ( */}
                        <Form.List name="items" initialValue={[]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                                        return (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="space-unit">
                                                <div className="row">
                                                    <div className="wrap-box col-sm-3">

                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'quantity']}
                                                            fieldKey={[fieldKey, 'quantity']}
                                                            label="Quantity"
                                                            rules={[{ required: true, message: 'Please enter quantity' }]}
                                                        >
                                                            <Input
                                                                placeholder="Quantity"
                                                                value={repeator[index].quantity}
                                                                onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'quantity', index)}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="wrap-box col-sm-3">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'unit_price']}
                                                            value={repeator[index].unit_price}
                                                            fieldKey={[fieldKey, 'unit_price']}
                                                            label="Unit Price"
                                                            rules={[{ required: true, message: 'Please enter unit price' }]}
                                                        >
                                                            <Input
                                                                placeholder="Unit Price"
                                                                onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'unit_price', index)}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="wrap-box col-sm-3">
                                                        <lable for="amount">Amount</lable>
                                                        <input name="amount" value={repeator[index].amount} placeholder="Amount" readOnly />
                                                    </div>
                                                    <div className="wrap-box col-sm-3">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'Description']}
                                                            value={repeator[index].description}
                                                            onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'description', index)}
                                                            fieldKey={[fieldKey, 'Description']}
                                                            label="Description"
                                                            rules={[{ required: true, message: 'Please enter description' }]}
                                                        >
                                                            <Input placeholder="Description" />
                                                        </Form.Item>
                                                    </div>

                                                </div>

                                                <div className="row">
                                                    <div class="col-sm-4">

                                                        {(shipmentType === 'Non Project Related' || shipmentType === 'Combined') && (
                                                            <>
                                                                <div className="selectwrap add-dropdown-wrap shipment-caret">
                                                                    {/* <CaretDownFilled className="caret-icon" /> */}
                                                                    {/* <Form.Item
                                                                                            label="Material For"
                                                                                            name={`materialFor-${index}`}
                                                                                            htmlFor="file"
                                                                                            class="same-clr"
                                                                                            value={repeator[index].materialFor}
                                                                                            rules={[
                                                                                                {
                                                                                                    required: true,
                                                                                                    message: "Please choose Material For",
                                                                                                },
                                                                                            ]}
                                                                                        >
                                                                                            <Select id="single90"
                                                                                                class="js-states form-control file-wrap-select"
                                                                                                onChange={(value) => {
                                                                                                    handleRepeatorChange(value, 'materialFor', index)
                                                                                                }}
                                                                                            >
                                                                                                {shipmentType === 'Combined' && <Option value="project">Project</Option>}
                                                                                                <Option value="inventory">Inventory</Option>
                                                                                                <Option value="supplies">Supplies/Expenses</Option>
                                                                                            </Select>
                                                                                        </Form.Item> */}
                                                                    <lable>Material For</lable>
                                                                    <select onChange={({ target: { value } }) => {
                                                                        handleRepeatorChange(value, 'materialFor', index)
                                                                    }} value={repeator[index].materialFor}>
                                                                        {shipmentType === 'Combined' && <option value="project">Project</option>}
                                                                        <option value="inventory">Inventory</option>
                                                                        <option value="supplies">Supplies/Expenses</option>
                                                                    </select>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="col-sm-4">
                                                        <div className="wrap-box">
                                                            {(repeator[index].materialFor === 'inventory' || repeator[index].materialFor === 'supplies') && (
                                                                // <Form.Item
                                                                //     label={repeator[index].materialFor === 'inventory' ? "Inventory Code" : "GL Code"}
                                                                //     name={`code_${index}`}
                                                                //     htmlFor="file"
                                                                //     className="same-clr"
                                                                //     value={repeator[index].code}
                                                                //     onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'code', index)}
                                                                //     rules={[
                                                                //         {
                                                                //             required: true,
                                                                //             message: `Please enter ${repeator[index].materialFor === 'inventory' ? "inventory" : "GL"} Code`,
                                                                //         },
                                                                //     ]}
                                                                // >
                                                                //     <Input />
                                                                // </Form.Item>
                                                                <input onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'code', index)} value={repeator[index].code} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        {repeator[index].materialFor === 'project' && (
                                                            <>
                                                                <div class="selectwrap add-dropdown-wrap">
                                                                    <div class="selectwrap columns-select shipment-caret ">
                                                                        <label>Project</label>
                                                                        <select onChange={({ target: { value } }) => {
                                                                            list(value);
                                                                            handleRepeatorChange(value, 'project', index)
                                                                        }
                                                                        }
                                                                            value={repeator[index].project}
                                                                        >
                                                                            {Array.isArray(projects) &&
                                                                                projects.map((project) => (
                                                                                    <option key={project.project_id} value={project.project_id}>
                                                                                        {project.name}
                                                                                    </option>
                                                                                ))}
                                                                        </select>
                                                                    </div>

                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="col-sm-4">
                                                        {repeator[index].materialFor === 'project' && (
                                                            <div class="selectwrap add-dropdown-wrap">
                                                                <div className="selectwrap columns-select shipment-caret ">
                                                                    {/* <CaretDownFilled className="caret-icon" /> */}
                                                                    <select onChange={({ target: { value } }) => handleRepeatorChange(value, 'site', index)}>
                                                                        {Array.isArray(siteOptions) &&
                                                                            siteOptions.map((site) => (
                                                                                <option key={site.site_id} value={site.site_id}>
                                                                                    {site.name}
                                                                                </option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <MinusOutlined className="minus-wrap" onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                            </Space>
                                        )
                                    }

                                    )}
                                    <Form.Item>
                                        <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                            setRepeator([...repeator, repeatorData]);
                                            add();
                                        }} icon={<PlusOutlined />}>
                                            Add More Material
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        {/* )} */}
                    </div>
                </div>
                <div className="row top-btm-space mb-0">
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
                            <label htmlFor="">First Name</label>
                            <input type="text" value={user.first_name} />
                            {/* <Form.Item

                                                    name='first_name'
                                                    label="First Name"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="" value={userFirstName}/>
                                                </Form.Item> */}

                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="wrap-box">
                            <label htmlFor="">Last Name</label>
                            <input type="text" value={user.last_name} />
                            {/* <Form.Item

                                                    name='last_name'
                                                    label="Last Name"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="" value={userLastName} />
                                                </Form.Item> */}

                        </div>
                    </div>
                </div>
                <div className="po-wrap create-wrap-butt m-0">
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="create-ven-butt">
                            Create PO
                        </Button>
                    </Form.Item>
                </div>
            </Form>

        </>
    )
}
export { getServerSideProps };
export default Material