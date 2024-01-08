import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
// import { getServerSideProps } from "@/components/mainVariable";
import moment from 'moment';
import axios from 'axios';
import { base_url } from './constant';
import { CalendarOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';


const { Option } = Select;
const repeatorData = {
    description: '',
    date: "",
    to: "",
    amount: '',

}
const Rental = () => {
    const [form] = Form.useForm();
    const [contacts, setContacts] = useState([]);
    const [contactId, setContactId] = useState('');
    const [vendors, setVendors] = useState([]);
    const [vendorForm, setVendorForm] = useState({
        company_name: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        country: ''
    });
    const [shipmentType, setshipmentType] = useState(null);
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [materialFor, setMaterialFor] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [repeator, setRepeator] = useState([]);

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
    const names = vendors?.map((vendor) => {
        return {
            vendorId: vendor.vendor_id,
            company_name: vendor.company_name,
        };
    });


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

    useEffect(() => {
        const fetchVendorContact = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/helping/vendors-and-contacts`, { headers: headers });
                console.log(response, 'ggggggggggggggggggg');
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

    const handleChange = ({ target: { name, value } }) => {
        setVendorForm({
            ...vendorForm,
            [name]: value
        })
    }

    const handlePoTypeChange = (value) => {
        setshipmentType(value);
    };
    const list = (value) => {
        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
            fetchSites(value);
        }
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
    useEffect(() => {
        const storedFirstName = localStorage.getItem('user_first_name');
        const storedLastName = localStorage.getItem('user_last_name');

        setUserFirstName(storedFirstName || '');
        setUserLastName(storedLastName || '');
    }, []);


    const handleRepeatorChange = (value, name, index) => {
        const values = repeator[index];
        if (values) {
            repeator[index] = {
                ...repeator[index],
                [name]: value
            }

            // if (repeator[index].quantity && repeator[index].unit_price) {
            //     console.log(parseFloat(repeator[index].quantity) * parseFloat(repeator[index].unit_price))
            //     repeator[index] = {
            //         ...repeator[index],
            //         amount: parseFloat(repeator[index].quantity) * parseFloat(repeator[index].unit_price)
            //     }
            // }
        }
        // if (name === 'unit_price' || name === 'quantity') {
        //     handleUnitPriceRepeaterChange();
        // }
        console.log(repeator, "============repa")
        setRepeator([...repeator]);
    }

    const onFinish = async (values) => { }
    return (
        <>
            <Form onFinish={onFinish} form={form} className="file-form">
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
                <div className="linewrap d-flex">
                    <span className="d-block me-4">Details</span>
                    <hr />
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="wrap-box">
                            <Form.Item
                                label="Description"
                                name="description"
                                for="file"
                                class="same-clr"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter description",
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} cols={50} />
                            </Form.Item>
                            {/* <label for="name">Description</label>
                            <textarea className="text-area" rows="4" cols="50"></textarea> */}
                        </div>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-sm-4">
                        <div className="d-flex align-items-center to-wrap-datepicker">
                            <div className="wrap-box mb-0">
                                <Form.Item
                                    label="Date Range"
                                    name="date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter date",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        suffixIcon={<CalendarOutlined />}
                                    />
                                </Form.Item>
                            </div>
                            <div className="text-to"><p class="mt-3">To</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="wrap-box mb-0">
                            <Form.Item
                                label="To"
                                name="to"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter date",
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>
                            {/* <label for="name">To</label>
                            <input type="date" /> */}
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="wrap-box mb-0">
                            <Form.Item
                                label="Amount"
                                name="amount"
                                for="file"
                                class="same-clr"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter amount",
                                    },
                                ]}
                            >
                                <Input />

                            </Form.Item>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">

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
                                            siteOptions.map((site) =>
                                            (
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

                </div>

                <div className="create-another minuswrap-img">
                    <Form.List name="items" initialValue={[]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                                    return (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="space-unit">
                                            <div className="row mb-2">
                                                <div className="wrap-box mb-0">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'description']}
                                                        fieldKey={[fieldKey, 'description']}
                                                        label="Description"
                                                        rules={[{ required: true, message: 'Please enter description' }]}
                                                    >
                                                        <Input
                                                            placeholder="description"
                                                            value={repeator[index].quantity}
                                                            onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'quantity', index)}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="row mt-1">
                                                <div className="col-sm-4 d-flex align-items-center">
                                                    <div className="wrap-box mb-0">
                                                        <Form.Item
                                                            label="Date Range"
                                                            {...restField}
                                                            name={[name, 'date']}
                                                            fieldKey={[fieldKey, 'date']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter date",
                                                                },
                                                            ]}
                                                        >
                                                            <DatePicker
                                                                style={{ width: "100%" }}
                                                                suffixIcon={<CalendarOutlined />}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="text-to"><p class="mt-3">To</p></div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="wrap-box mb-0">
                                                        <Form.Item
                                                            label="To"
                                                            {...restField}
                                                            name={[name, 'to']}

                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter date",
                                                                },
                                                            ]}
                                                        >
                                                            <DatePicker
                                                                style={{ width: "100%" }}
                                                                suffixIcon={<CalendarOutlined />}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4">
                                                    <div className="wrap-box mb-0">
                                                        <Form.Item
                                                            label="Amount"
                                                            name="amount"
                                                            for="file"
                                                            class="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter amount",
                                                                },
                                                            ]}
                                                        >
                                                            <Input />

                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                {/* <label for="name">To</label>
                            <input type="date" /> */}


                                            </div>
                                            <MinusOutlined className="minus-wrap" onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                        </Space>
                                    )
                                })}
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
                </div>
                {/* <Form.Item>
                        <Button className="add-more-btnn" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                            <span >Add More Item</span>
                        </Button>
                    </Form.Item> */}
                {/* <div className="row top-btm-space mb-0"> */}
                <div className="row">
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
                {/* </div> */}
                {/* {shipmentType === 'Project Related' && (
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
                                        siteOptions.map((site) =>
                                        (
                                            <Select.Option key={site.site_id} value={site.site_id}>
                                                {site.name}
                                            </Select.Option>
                                        )
                                        )}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )} */}
                {(shipmentType === 'Non Project Related' || shipmentType === 'Combined') && (
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
                                    {shipmentType === 'Combined' && <Option value="project">Project</Option>}
                                    <Option value="inventory">Inventory</Option>
                                    <Option value="supplies">Supplies/Expenses</Option>

                                </Select>
                            </Form.Item>
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
                                        message: "Please enter Inventory Code",
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
                    </div>
                </div>
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
                </div>


                <div class="linewrap d-flex">
                    <span class="d-block me-2">By Details</span>
                    <hr />
                </div>
                <div className="row">
                    <div class="col-lg-4 col-md-6">
                        <div class="wrap-box">
                            <label htmlFor="">First Name</label>
                            <input type="text" value={userFirstName} />
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="wrap-box">
                            <label htmlFor="">Last Name</label>
                            <input type="text" value={userLastName} />
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
// export { getServerSideProps };
export default Rental