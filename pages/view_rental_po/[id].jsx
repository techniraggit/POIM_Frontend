import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { fetchPo, fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, updatePo } from "@/apis/apis/adminApis";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import moment from "moment";
import withAuth from "@/components/PrivateRoute";

const { Option } = Select;

const repeatorData = {
    amount: 0,
    description: '',
    start_date: '',
    end_date: '',
    // material_for: '',
    project_id: '',
    project_site_id: ''
}

const ViewPO = () => {
    const [vendors, setVendors] = useState([]);
    const [shipmentType, setshipmentType] = useState(null);
    const [formData, setFormData] = useState({
        po_type: '',
        amount: 0,
        company_name: '',
        vendor_id: '',
        vendor_contact_id: '',
        shipment_type: '',
        hst_amount: '',
        total_amount: '',
        project_site_id: '',
        company_name: '',
        country: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        shipment_type: '',
        material_details: []
    });

    const [contactId, setContactId] = useState('');
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;

    useEffect(() => {
        const response = fetchVendorContact();
        response.then((res) => {
            if (res?.data?.status) {
                setVendors([...res.data.vendors]);
            }
        });
        fetchPo(id).then((res) => {
            if (res?.data?.status) {
                const data = res.data.data;
                console.log(data, 'ghfhhggdgh');
                fetchVendorContactDropdown(data.vendor_contact.company.vendor_id);
                fetchSites();
                setFormData({
                    ...formData,
                    po_type: data.po_type,
                    amount: data.total_amount,
                    company_name: data.vendor_contact.company.company_name,
                    vendor_id: data.vendor_contact.company.vendor_id,
                    vendor_contact_id: data.vendor_contact.vendor_contact_id,
                    hst_amount: data.hst_amount,
                    total_amount: data.total_amount,
                    project_site_id: data.project_site,
                    country: data.vendor_contact.company.country,
                    state: data.vendor_contact.company.state,
                    address: data.vendor_contact.company.address,
                    phone: data.vendor_contact.phone_number,
                    email: data.vendor_contact.email,
                    shipment_type: data.shipment_type,
                    material_details: [...data.material_details]
                });
                form.setFieldValue('po_type', data.po_type);
                form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                form.setFieldValue('vendor_id', data.vendor_contact.company.vendor_id);
                form.setFieldValue('vendor_contact_id', data.vendor_contact.vendor_contact_id);
                form.setFieldValue('shipment_type', data.shipment_type);
                form.setFieldValue('hst_amount', (data.hst_amount).toFixed(2)) || 0;
                form.setFieldValue('total_amount', data.total_amount);
                form.setFieldValue('project_id', data.project_site?.project?.project_id);
                form.setFieldValue('project_site_id', data.project_site?.site_id);
                form.setFieldValue('poDate', moment(data.po_date));
                form.setFieldValue('country', data.vendor_contact.company.country);
                form.setFieldValue('state', data.vendor_contact.company.state);
                form.setFieldValue('address', data.vendor_contact.company.address);
                form.setFieldValue('phone', data.vendor_contact.phone_number);
                form.setFieldValue('email', data.vendor_contact.email);
                form.setFieldValue('poNumber', data.po_number)
                form.setFieldValue('shipment_type', data.shipment_type)
                form.setFieldValue('amount', data.material_details[0]?.amount)
                form.setFieldValue('description', data.material_details[0]?.description)
                form.setFieldValue('start_date', data.material_details[0]?.date)
                form.setFieldValue('end_date', data.material_details[0]?.end_date)
                form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                form.setFieldValue('first_name', data.created_by.first_name)
                form.setFieldValue('last_name', data.created_by.last_name)
            }
        });
    }, []);

    useEffect(() => {
        if (form.getFieldValue('shipment_type') === 'project related' || form.getFieldValue('shipment_type') === 'combined') {
            const response = fetchProjects();
            response.then((res) => {
                if (res?.data?.status) {
                    setProjects(res.data.projects);
                }
            });
        }
    }, [form.getFieldValue('shipment_type')]);

    const fetchVendorContactDropdown = (id) => {
        const response = fetchVendorContacts(id);
        response.then((res) => {
            if (res?.data?.status) {
                setContactId([...res.data.vendors])
            }
        })
    }

    const names = vendors?.map((vendor) => {
        return {
            vendorId: vendor.vendor_id,
            company_name: vendor.company_name,
        };
    });





    const handleAmountChange = (value) => {
        console.log(value, 'amount');
        setAmount(value);
        updateAmount(value);
    };
    const updateAmount = (amount) => {
        const calculatedAmount = amount;
        console.log(calculatedAmount, 'calculatedAmount');
        setAmount(calculatedAmount);
        form.setFieldsValue({ Amount: calculatedAmount });
        form.setFieldsValue({ HST_Amount: calculatedAmount * 0.13 });
        form.setFieldsValue({ Total_amount: calculatedAmount * 0.13 + parseInt(calculatedAmount) });
    };

    const calculateAmount = (amount) => amount;

    const handleRepeaterAmountChange = () => {
        const totalAmount = getTotalAmount();
        form.setFieldsValue({ HST_Amount: totalAmount * 0.13 });
        form.setFieldsValue({ Total_amount: totalAmount * 0.13 + parseInt(totalAmount) });
    };

    const getTotalAmount = () => {
        const repeaterLength = form.getFieldValue(['items']) ? form.getFieldValue(['items']).length : 0;
        let totalAmount = 0;

        for (let i = 0; i < repeaterLength; i++) {
            const amount = repeator[i].amount || 0;
            // const unitPrice = repeator[i].unit_price || 0;
            const amountPrice = calculateAmount(amount);
            totalAmount += amountPrice;
        }

        if (amount) {
            totalAmount = totalAmount + parseInt(amount);
        } else {
            totalAmount = totalAmount
        }

        return totalAmount;
    };

    const handleRepeatorChange = (value, name, index) => {
        const values = repeator[index];
        if (values) {
            repeator[index] = {
                ...repeator[index],
                [name]: value
            }

            if (repeator[index].amount) {
                console.log(parseFloat(repeator[index].amount, 'arseFloat(repeator[index].amount'))
                repeator[index] = {
                    ...repeator[index],
                    amount: parseFloat(repeator[index].amount)
                }
            }
        }
        if (name === 'amount') {
            handleRepeaterAmountChange();
        }
        console.log(repeator, "============repa")
        setRepeator([...repeator]);
    }

    const onFinish = () => {
        updatePo({
            ...formData,
            po_id: id,
            project_site_id: formData.project_site_id?.site_id
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        });
    }

    const onChange = (name, value, index) => {
        if (name === 'material_details') {
            const materialDetails = formData.material_details;
            Object.keys(value).map((key) => {
                materialDetails[index][key] = value[key];
            });
            if (value.unit_price) {
                updateAmount(materialDetails[index].quantity, value.unit_price, index);
            } else if (value.quantity) {
                updateAmount(quantity, materialDetails[index].unit_price, index);
            }
            setFormData({
                ...formData,
                material_details: [...materialDetails]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        if (value.unit_price || value.quantity || name === 'unit_price' || name === 'quantity') {
            handleUnitPriceRepeaterChange();
        }
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
        if (formData.shipment_type === 'project related' || formData.shipment_type === 'combined') {
            fetchSites(value);
        }
    };

    const handlePoTypeChange = (value) => {
        setshipmentType(value);
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Edit rental po' />
                    <div className="bottom-wrapp">
                        <ul class=" create-icons">
                            <li class="icon-text react-icon">
                                <PlusOutlined />
                                <span>View Purchase Order</span>
                            </li>
                        </ul>
                        <div class="choose-potype round-wrap">
                            <div class="inner-choose">
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
                                                <Form.Item
                                                    label="Company name"
                                                    name="company_name"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Enter Company name",
                                                        },
                                                    ]}
                                                >
                                                    <Input readOnly onChange={({ target: { value } }) => onChange('company_name', value)} />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Email"
                                                    name="email"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Enter Email",
                                                        },
                                                    ]}
                                                >
                                                    <Input readOnly onChange={({ target: { value } }) => onChange('email', value)} />
                                                </Form.Item>

                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Phone"
                                                    name="phone"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Enter Phone",
                                                        },
                                                    ]}
                                                >
                                                    <Input readOnly onChange={({ target: { value } }) => onChange('phone', value)} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box mb-0">
                                                <Form.Item
                                                    label="Address"
                                                    name="address"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Enter Company address",
                                                        },
                                                    ]}
                                                >
                                                    <Input readOnly onChange={({ target: { value } }) => onChange('address', value)} />
                                                </Form.Item>

                                            </div>
                                        </div>

                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box mb-0">
                                                <Form.Item
                                                    label="State / Province"
                                                    name="state"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Enter State",
                                                        },
                                                    ]}
                                                >
                                                    <Input readOnly onChange={({ target: { value } }) => onChange('state', value)} />
                                                </Form.Item>


                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box mb-0">
                                                <Form.Item
                                                    label="Country"
                                                    name="country"
                                                    class="bold-label"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please Enter Country",
                                                        },
                                                    ]}
                                                >
                                                    <Input readOnly onChange={({ target: { value } }) => onChange('country', value)} />
                                                </Form.Item>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Ship To</span>
                                        <hr />
                                    </div>
                                    <div class="row space-bottom mb-0">
                                        <div class="col-lg-4 col-md-6 all-wrap-box">
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
                                                    </Select>
                                                </Form.Item>
                                            </div>

                                        </div>
                                        <div className="col-lg-4">
                                            {formData.shipment_type === 'Project Related' && (
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center to-wrap-datepicker">
                                            <div className="wrap-box">
                                                <Form.Item
                                                    label="Date Range"
                                                    name="start_date"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter date",
                                                        },
                                                    ]}
                                                >
                                                    <Input type="date"></Input>
                                                </Form.Item>
                                            </div>
                                            <div className="text-to ps-2"><p className='mb-2'>To</p></div>
                                        </div>

                                        <div className="col-sm-4">
                                            <div className="wrap-box">
                                                <Form.Item
                                                    label="To"
                                                    name="end_date"
                                                    //  initialValue={moment(formattedDate, "YYYY-MM-DD")}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter date",
                                                        },
                                                    ]}
                                                >
                                                    <Input type="date"></Input>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="wrap-box">
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
                                                    <Input onChange={(e) => handleAmountChange(e.target.value)} />

                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {formData.shipment_type === 'Project Related' && (
                                            <div class="col-sm-4">
                                                <div className="selectwrap columns-select shipment-caret ">
                                                    <Form.Item
                                                        label="Select Site"
                                                        name="project_site_id"
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
                                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="space-unit mb-space">
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
                                                                                value={repeator[index].description}
                                                                                onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'description', index)}
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
                                                                                name={[name, 'start_date']}
                                                                                fieldKey={[fieldKey, 'start_date']}

                                                                                rules={[
                                                                                    {
                                                                                        required: true,
                                                                                        message: "Please enter date",
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Input type="date"
                                                                                    value={repeator[index].start_date}
                                                                                    onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'start_date', index)}
                                                                                />
                                                                            </Form.Item>
                                                                        </div>
                                                                        <div className="text-to"><p className='mt-3'>To</p></div>
                                                                    </div>

                                                                    <div className="col-sm-4">
                                                                        <div className="wrap-box mb-0">
                                                                            <Form.Item
                                                                                label="To"
                                                                                {...restField}
                                                                                name={[name, 'end_date']}
                                                                                fieldKey={[fieldKey, 'end_date']}
                                                                                value={repeator[index].end_date}

                                                                                rules={[
                                                                                    {
                                                                                        required: true,
                                                                                        message: "Please enter date",
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Input type="date"
                                                                                    value={repeator[index].end_date}
                                                                                    onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'end_date', index)}

                                                                                />
                                                                            </Form.Item>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <div className="wrap-box mb-0">
                                                                            <Form.Item
                                                                                label="Amount"
                                                                                {...restField}
                                                                                name={[name, 'amount']}
                                                                                fieldKey={[fieldKey, 'amount']}
                                                                                value={repeator[index].amount}
                                                                                for="file"
                                                                                class="same-clr"
                                                                                rules={[
                                                                                    {
                                                                                        required: true,
                                                                                        message: "Please enter amount",
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Input
                                                                                    // value={repeator[index].amount}
                                                                                    onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'amount', index)}
                                                                                />

                                                                            </Form.Item>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="row">
                                                                    {shipmentType === 'Project Related' && (
                                                                        <div class="col-sm-4">
                                                                            <div className="selectwrap columns-select shipment-caret ">
                                                                                <Form.Item
                                                                                    label="Select Site"
                                                                                    {...restField}
                                                                                    name={[name, 'site_id']}
                                                                                    fieldKey={[fieldKey, 'site_id']}
                                                                                    value={repeator[index].site_id}
                                                                                    // name="site_id"
                                                                                    htmlFor="file"
                                                                                    class="same-clr"
                                                                                    rules={[
                                                                                        {
                                                                                            required: true,
                                                                                            message: "Please choose site",
                                                                                        },
                                                                                    ]}
                                                                                    onChange={({ target: { value, name } }) => handleRepeatorChange(value, 'site_id', index)}
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
                                                                    <div className="col-sm-4 minus-align-mid d-flex align-items-center">
                                                                        <MinusOutlined className="minus-wrap" onClick={() => remove(name)} style={{ marginLeft: '8px' }} />
                                                                    </div>
                                                                </div>

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
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item

                                                    name='hst_amount'
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

                                                    name='total_amount'
                                                    label="Total Amount"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input placeholder="Total Amount" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    {/* {(shipmentType === 'Non Project Related' || shipmentType === 'Combined') && (
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
                )} */}
                                    <div className="col-md-4">
                                        {/* <div className="wrap-box">
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
                    </div> */}
                                    </div>
                                    <div className="col-md-4">
                                        {/* {materialFor === 'project' && (
                        <div class="selectwrap add-dropdown-wrap">
                            <div className="selectwrap columns-select shipment-caret ">
                               
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
                    )} */}
                                        <div className="col-md-4">
                                            {/* <div className="wrap-box">
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
                        </div> */}
                                        </div>
                                        <div className="col-md-4">
                                            {/* {materialFor === 'project' && (
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
                        )} */}
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
                                                    rules={[{ required: true, message: 'Please enter First Name' }]}
                                                >
                                                    <Input readOnly placeholder="First Name" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    name='last_name'
                                                    label="Last Name"
                                                    rules={[{ required: true, message: 'Please enter Last Name' }]}
                                                >
                                                    <Input readOnly placeholder="Last Name" />
                                                </Form.Item>
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
                                </Form >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { getServerSideProps };
export default withAuth(['admin', 'accounting', 'project manager', 'department manager',
    'director', 'supervisor', 'project coordinate', 'marketing', 'health & safety', 'estimator', 'shop'])(ViewPO)

// export default ViewPO;