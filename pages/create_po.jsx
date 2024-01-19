import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../styles/style.css'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/router';
import { createPO, fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, getVendorDetails, getPoNumber } from "@/apis/apis/adminApis";
import withAuth from '../components/PrivateRoute';

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

const Create_po = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [shipmentType, setshipmentType] = useState(null);
    const [materialFor, setMaterialFor] = useState('');
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [userName, setUserName] = useState({
        firstName: '',
        lastName: ''
    });

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
        state: '',
        country: ''
    })

    const handleChange = ({ target: { name, value } }) => {
        setVendorForm({
            ...vendorForm,
            [name]: value
        })
    }

    const calculateAmount = (quantity, unitPrice) => quantity * unitPrice;

    const handleUnitPriceRepeaterChange = () => {
        const totalAmount = getTotalAmount();
        const hstAmount = (totalAmount * 0.13).toFixed(2) || 0;
        const totalAmountWithHst = (parseFloat(hstAmount) + totalAmount).toFixed(2) || 0;

        form.setFieldsValue({ HST_Amount: hstAmount });
        form.setFieldsValue({ Total_amount: totalAmountWithHst });

        // form.setFieldsValue({ HST_Amount: totalAmount * 0.13 });
        // form.setFieldsValue({ Total_amount: totalAmount * 0.13 + totalAmount });
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

    // const updateAmount = (quantity, unitPrice) => {
    //     const calculatedAmount = quantity * unitPrice;
    //     setAmount(calculatedAmount);
    //     form.setFieldsValue({ Amount: calculatedAmount });
    //     form.setFieldsValue({ HST_Amount: calculatedAmount * 0.13 });
    //     form.setFieldsValue(({ Total_amount: calculatedAmount * 0.13 + calculatedAmount }));
    // };


    const updateAmount = (quantity, unitPrice) => {
        const calculatedAmount = quantity * unitPrice;
        const hstAmount = calculatedAmount * 0.13;
        const totalAmount = calculatedAmount + hstAmount;

        setAmount(calculatedAmount);

        // Format the calculatedAmount, HST amount, and Total amount to have 2 decimal places
        form.setFieldsValue({
            Amount: `$${calculatedAmount.toFixed(2) || 0}`,
            HST_Amount: `$${hstAmount.toFixed(2) || 0}`,
            Total_amount: `$${totalAmount.toFixed(2) || 0}`,
        });
    };

    const handlePoTypeChange = (value) => {
        setshipmentType(value);
    };

    const onFinish = (values) => {
        let data;
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
            data = {
                po_type: values.po_type,
                amount: values.Amount,
                vendor_contact_id: values.vendor_contact_id,
                shipment_type: values.shipment_type,
                po_number: values.poNumber,
                hst_amount: values.HST_Amount,
                total_amount: values.Total_amount,
                project_site_id: values.site_id,
                material_details: [...dynamicItems]
            }
        } else {
            data = {
                po_type: values.po_type,
                vendor_contact_id: values.vendor_contact_id,
                shipment_type: values.shipment_type,
                po_number: values.poNumber,
                hst_amount: values.HST_Amount,
                total_amount: values.Total_amount,
                project_site_id: values.site_id,
                amount: values.Amount,
                material_details: [{
                    quantity: values.quantity,
                    unit_price: values.unit_price,
                    amount: values.Amount,
                    description: values.Description,
                    material_for: values.materialFor,
                    code: values.code,
                    project_id: values.project_id,
                    project_site_id: values.site_id,
                }]
            }
        }

        const response = createPO(data);
        console.log(response, 'ggggggggg');

        response.then((res) => {
            if (res?.data?.status) {
                message.success(res.data?.message)
                router.push('/po_list')
            }
        });
    };

    useEffect(() => {
        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
            const response = fetchProjects();
            response.then((res) => {
                if (res?.data?.status) {
                    setProjects(res.data.projects);
                }
            });
        }
    }, [shipmentType]);

    useEffect(() => {
        const response = fetchVendorContact();
        response.then((res) => {
            if (res?.data?.status) {
                setVendors([...res.data.vendors]);
            }
        })
        setUserName({
            firstName: localStorage.getItem('user_first_name'),
            lastName: localStorage.getItem('user_last_name')
        })
    }, [])

    const fetchVendorContactDropdown = (id) => {
        const response = fetchVendorContacts(id);
        response.then((res) => {
            if (res?.data?.status) {
                setContactId([...res.data.vendors])
            }
        })
    }

    const fetchSites = () => {
        const response = fetchProjectSites();

        response.then((res) => {
            if (res?.data?.status) {
                const sitesArray = res.data.sites;
                setSiteOptions(sitesArray);
            }
        })
    };

    const list = (value) => {
        if (shipmentType === 'Project Related' || shipmentType === 'Combined') {
            fetchSites(value);
        }
    };

    const vendorContactDetails = async (id) => {
        const response = getVendorDetails(id)
        response.then((res) => {
            if (res.data?.status) {
                setVendorForm({
                    ...vendorForm,
                    company_name: res.data.vendors.company.company_name,
                    email: res.data.vendors.email,
                    phone: res.data.vendors.phone_number,
                    address: res.data.vendors.company.address,
                    state: res.data.vendors.company.state,
                    country: res.data.vendors.company.country
                })
            }
        })
    }

    const names = vendors?.map((vendor) => {
        return {
            vendorId: vendor.vendor_id,
            company_name: vendor.company_name,
        };
    });

    const handleRepeatorChange = (value, name, index) => {
        const values = repeator[index];
        console.log(values, 'jjjjjjjjjjjjjjjjjjjjjjjjj');
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


    const handleRemoveItem = (index) => {
        const updatedRepeator = [...repeator];
        updatedRepeator.splice(index, 1); // Remove the item at the specified index
        setRepeator(updatedRepeator);

        handleUnitPriceRepeaterChange(); // Recalculate HST and total amount after removing an item
    };

    const handleSelectChange = (selectedValue) => {
        // const rentalPoPageUrl = "/rental-po";

        if (selectedValue === "rental") {
            router.push('/rental-po');
        } else if (selectedValue === 'subcontractor') {
            router.push('/create-subcontractor-po');
        }
    }

    useEffect(() => {
        const poNumberResponse = getPoNumber();
        // console.log(poNumberResponse,'poNumberResponse');
        poNumberResponse.then((response) => {
            // console.log(response,'response');
            if (response?.data?.status) {
                form.setFieldValue('poNumber', response.data.po_number);
            }
        })
    }, []);

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
                        <div className="choose-potype round-wrap">
                            <div className="inner-choose">
                                <Form onFinish={onFinish} form={form} className="file-form">
                                    <div className="row po-typeraw">
                                        <div className="col-lg-4 col-md-6">
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
                                                        onChange={handleSelectChange}
                                                    >
                                                        <Select placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                            onChange={handleSelectChange}
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
                                                initialValue={moment()}
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
                                                    disabled
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
                                                            {names.map((entry) => (
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
                                        <div class="col-md-6 col-lg-4 all-wrap-box">
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
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            {shipmentType === 'Project Related' && (
                                                <div class="selectwrap columns-select shipment-caret">
                                                    <Form.Item
                                                        label="Project  "
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
                                        <div className="col-lg-3">
                                            {/* {shipmentType === 'Non Project Related' && (
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
                                            )} */}
                                        </div>


                                    </div>
                                    {/* </div> */}
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Material</span>
                                        <hr />
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-4">
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
                                                        {
                                                            pattern: /^(?:\d+|\d*\.\d+)$/,
                                                            message: "Please enter a valid number only",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Quantity" onChange={(e) => handleQuantityChange(e.target.value)} />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="col-sm-4">
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
                                                        {
                                                            pattern: /^(?:\d+|\d*\.\d+)$/,
                                                            message: "Please enter a valid number only",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Unit Price" onChange={(e) => handleUnitPriceChange(e.target.value)} />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="col-sm-4">
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
                                                >
                                                    <Input placeholder="Amount" readOnly />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="row space-col-spc mb-0">
                                            <div class="col-sm-4">
                                                <div className="wrap-box mb-0">
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
                                                                {shipmentType === 'Combined' && <option value="project">Project</option>}
                                                                <Option value="inventory">Inventory</Option>
                                                                <Option value="supplies">Supplies/Expenses</Option>

                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )}

                                            {/* {shipmentType === 'Combined' && (
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
                                    )} */}
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

                                        <div className="row select-sitee mt-3">

                                            <div className="col-md-4">
                                                {materialFor === 'project' && (
                                                    <div class="selectwrap add-dropdown-wrap">
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
                                        <div className="create-another minuswrap-img">
                                            <Form.List name="items" initialValue={[]}>
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                                                            return (
                                                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="space-unit">
                                                                    <div className="row">
                                                                        <div className="wrap-box col-sm-3 kt">

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
                                                                            <label for="amount">Amount</label>
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

                                                                            <div className="wrap-box select-po-non  mb">
                                                                                {(shipmentType === 'Non Project Related' || shipmentType === 'Combined') && (
                                                                                    <>
                                                                                        <label>Material For</label>
                                                                                        <select onChange={({ target: { value } }) => {
                                                                                            handleRepeatorChange(value, 'materialFor', index)
                                                                                        }} value={repeator[index].materialFor}>
                                                                                            {shipmentType === 'Combined' && <option value="project">Project</option>}
                                                                                            <option value="inventory">Inventory</option>
                                                                                            <option value="supplies">Supplies/Expenses</option>
                                                                                        </select>
                                                                                    </>
                                                                                    // <div class="col-sm-4 ">
                                                                                    //     <div className="selectwrap add-dropdown-wrap shipment-caret">
                                                                                    //         <Form.Item
                                                                                    //             {...restField}
                                                                                    //             label="Material For"
                                                                                    //             name={[name, 'materialFor']}
                                                                                    //             value={repeator[index].materialFor}
                                                                                    //             onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'materialFor', index)}
                                                                                    //             htmlFor="file"
                                                                                    //             class="same-clr"
                                                                                    //             rules={[
                                                                                    //                 {
                                                                                    //                     required: true,
                                                                                    //                     message: "Please choose Material For",
                                                                                    //                 },
                                                                                    //             ]}
                                                                                    //         >
                                                                                    //             <Select id="single90"
                                                                                    //                 class="js-states form-control file-wrap-select"
                                                                                    //                 onChange={(value) => setMaterialFor(value)}
                                                                                    //             >
                                                                                    //                 {shipmentType === 'Combined' && <option value="project">Project</option>}
                                                                                    //                 <Option value="inventory">Inventory</Option>
                                                                                    //                 <Option value="supplies">Supplies/Expenses</Option>

                                                                                    //             </Select>
                                                                                    //         </Form.Item>
                                                                                    //     </div>
                                                                                    // </div>
                                                                                )}



                                                                                {/* <div className="wrap-box mb-0"> */}
                                                                                {/* {(repeator[index].materialFor === 'inventory' || repeator[index].materialFor === 'supplies') && (
                                                                                    <>
                                                                                        <label>
                                                                                            {repeator[index].materialFor === 'inventory' ? "Inventory Code" : "GL Code"}
                                                                                        </label>
                                                                                        <input onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'code', index)} value={repeator[index].code} />
                                                                                    </>
                                                                                )} */}
                                                                                {/* </div> */}


                                                                                {/* {(shipmentType === 'Non Project Related' || shipmentType === 'Combined') && (materialFor === 'inventory' || materialFor === 'supplies') && (
                                                                                <>
                                                                                    <label>{materialFor === 'inventory' ? "Inventory Code" : "GL Code"}</label>
                                                                                    <input onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'code', index)} value={repeator[index].code} />
                                                                                </>
                                                                            )} */}
                                                                                {/* {((shipmentType == 'Combined')) && (materialFor == 'project') && (
                                                                                <div class="selectwrap add-dropdown-wrap">
                                                                                    <div className="selectwrap columns-select shipment-caret ">
                                                                                        <Form.Item
                                                                                            {...restField}
                                                                                            label="Select Site"

                                                                                            name={[name, 'site_id']}
                                                                                            value={repeator[index].site_id}
                                                                                            onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'site_id', index)}
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
                                                                            )

                                                                            } */}
                                                                                {shipmentType === 'Project Related' && (
                                                                                    <>
                                                                                        <div className="selectwrap columns-select shipment-caret ">
                                                                                            <Form.Item
                                                                                                {...restField}
                                                                                                label="Select Site"

                                                                                                name={[name, 'site_id']}
                                                                                                value={repeator[index].site_id}
                                                                                                onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'site_id', index)}
                                                                                                htmlFor="file"
                                                                                                class="same-clr"
                                                                                                rules={[
                                                                                                    {
                                                                                                        required: true,
                                                                                                        message: "Please choose site",
                                                                                                    },
                                                                                                ]}
                                                                                            >
                                                                                                <Select id="singlesa" class="js-states form-control file-wrap-select"
                                                                                                >
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
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            </div>

                                                                            <div className="col-sm-4">
                                                                                <div className="wrap-box">
                                                                                    {(repeator[index].materialFor === 'inventory' || repeator[index].materialFor === 'supplies') && (
                                                                                        <>
                                                                                            <label>
                                                                                                {repeator[index].materialFor === 'inventory' ? "Inventory Code" : "GL Code"}
                                                                                            </label>
                                                                                            <input onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'code', index)} value={repeator[index].code} />
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* </div> */}


                                                                            {/* <div className="col-sm-4"> */}

                                                                            {/* {repeator[index].materialFor === 'project' && (
                                                                                <>
                                                                                    <div class="top-project">
                                                                                        <div class="selectwrap columns-select shipment-caret ">
                                                                                            <label>Project</label>
                                                                                            <select className="js-states form-control custom-wrap-selector ant-select-selector" onChange={({ target: { value } }) => {
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
                                                                            )} */}

                                                                            {/* <div className="col-sm-4 "> */}
                                                                            {repeator[index].materialFor === 'project' && (
                                                                                <div class="selectwrap shipment-caret add-dropdown-wrap">
                                                                                    <div className="selectwrap columns-select shipment-caret ">
                                                                                        <label>Project Site</label>

                                                                                        <select className="js-states form-control custom-wrap-selector ant-select-selector" onChange={({ target: { value } }) => handleRepeatorChange(value, 'site', index)}>
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
                                                                        
                                                                        {/* </div> */}
                                                                        <div className="col-sm-4">
                                                                            <div className="hide-wrap">
                                                                                <MinusOutlined className="minus-wrap" onClick={() => {
                                                                                    remove(name);
                                                                                    handleRemoveItem(index); // Call the function to handle item removal
                                                                                }} style={{ marginLeft: '8px' }} />
                                                                                {/* <MinusOutlined className="minus-wrap" onClick={() => 
                                                                            remove(name)
                                                                          

                                                                            }
                                                                            
                                                                            style={{ marginLeft: '8px' }} /> */}
                                                                            </div>

                                                                        </div>
                                                                    </div>
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
                                                <input type="text" value={userName.firstName} />

                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <label htmlFor="">Last Name</label>
                                                <input type="text" value={userName.lastName} />

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
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default withAuth(['admin', 'project manager', 'supervisor', 'project coordinate', 'marketing', 'health & safety', 'estimator', 'shop'])(Create_po);