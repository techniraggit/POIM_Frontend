import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../styles/style.css'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { createPO, fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, getPoNumber, getVendorDetails } from "@/apis/apis/adminApis";
import { Form, Input, Select, Button, DatePicker, Space } from "antd";
import moment from "moment";

const { Option } = Select;

const repeatorData = {
    description: '',
    date: '',
    amount: 0,
    project_site_id: ''
}

const CreateSubContractorPo = () => {
    const [vendors, setVendors] = useState([]);

    const [formData, setFormData] = useState({
        po_number: '',
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
        delivery_address: '',
        quantity: 0,
        material_details: [{ ...repeatorData }]
    });

    const [contactId, setContactId] = useState('');
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [isNew, setISNew] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldValue('po_type', 'subcontractor');
        form.setFieldValue('poDate', moment());
        const response = fetchVendorContact();
        response.then((res) => {
            if (res?.data?.status) {
                setVendors([...res.data.vendors]);
                setFormData({
                    ...formData,
                    po_type: 'subcontractor',
                    po_date: moment().format('DD-MM-YYYY')
                })
            }
        })

        form.setFieldValue('first_name', localStorage.getItem('user_first_name'))
        form.setFieldValue('last_name', localStorage.getItem('user_last_name'))
    }, []);

    useEffect(() => {
        if (isNew) {
            const poNumberResponse = getPoNumber();
            poNumberResponse.then((res) => {
                if (res?.data?.status) {
                    form.setFieldValue('poNumber', res.data?.po_number);
                    setFormData({
                        ...formData,
                        po_number: res.data.po_number
                    });
                }
            })
        }
    }, [isNew]);

    useEffect(() => {
        if (form.getFieldValue('shipment_type') === 'project related') {
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

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const vendorContactDetails = (id) => {
        const response = getVendorDetails(id)
        response.then((res) => {
            if (res.data?.status) {
                formData.company_name = res.data.vendors.company.company_name;
                formData.email = res.data.vendors.email;
                formData.phone = res.data.vendors.phone_number;
                formData.address = res.data.vendors.company.address;
                formData.state = res.data.vendors.company.state;
                formData.country = res.data.vendors.company.country;

                form.setFieldsValue({ 'company_name': res.data.vendors.company.company_name });
                form.setFieldsValue({ 'email': res.data.vendors.email });
                form.setFieldsValue({ 'phone': res.data.vendors.phone_number });
                form.setFieldsValue({ 'address': res.data.vendors.company.address });
                form.setFieldsValue({ 'state': res.data.vendors.company.state });
                form.setFieldsValue({ 'country': res.data.vendors.company.country });
            }
        })
    }

    const onFinish = () => {
        createPO({
            ...formData,
            subcontractor_type: isNew ? 'new' : 'existing'
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        });
    }

    const onChange = (name, value, index) => {
        if (name === 'material_details') {
            let totalAmount = 0;
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if (value.amount) {
                totalAmount = getTotalAmount();
            }
            formData.material_details[index] = {
                ...materalDetails
            };
            formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
            formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
            if (totalAmount > 0) {
                form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) || 0 });
                form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
            }
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
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
                                <span>Create Purchase Order</span>
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
                                                    >
                                                        <Select disabled placeholder="Select PO Type" id="single1"
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
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap react-select">
                                                <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                                    <Form.Item
                                                        label="Choose PO Type"
                                                        name="subcontractor_type"
                                                        class="bold-label"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose PO Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select defaultValue="existing" onChange={(value) => setISNew(value === 'new')} placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                        >
                                                            <Option value="existing">Existing</Option>
                                                            <Option value="new">New</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="order-choose d-flex">
                                        <div className="left-wrap wrap-number sub-po-typee">
                                            <Form.Item
                                                label="Purchase Order Number"
                                                name="poNumber"
                                            >
                                                <Input placeholder="Enter Po Number" onChange={({ target: { value } }) => onChange('po_number', value)} readOnly={isNew} />
                                            </Form.Item>
                                        </div>

                                        <div className="left-wrap wrap-number" id="forspce">
                                            <Form.Item
                                                label="Date"
                                                name="poDate"
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
                                                            onChange={(value) => {
                                                                fetchVendorContactDropdown(value)
                                                                onChange('vendor_id', value);
                                                            }}
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
                                                            onChange={(value) => {
                                                                vendorContactDetails(value);
                                                                onChange('vendor_contact_id', value);
                                                            }}
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
                                                    <Input onChange={({ target: { value } }) => onChange('company_name', value)} />
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
                                                    <Input onChange={({ target: { value } }) => onChange('email', value)} />
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
                                                    <Input onChange={({ target: { value } }) => onChange('phone', value)} />
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
                                                    <Input onChange={({ target: { value } }) => onChange('address', value)} />
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
                                                    <Input onChange={({ target: { value } }) => onChange('state', value)} />
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
                                                    <Input onChange={({ target: { value } }) => onChange('country', value)} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Ship To</span>
                                        <hr />
                                    </div>
                                    <div class="row space-bottom">
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
                                                        onChange={(value) => { onChange('shipment_type', value) }}
                                                    >
                                                        <Option value="project related">Project Related</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        {formData.shipment_type === 'project related' && (
                                            <div className="col-lg-4 col-md-6">
                                                <div class="selectwrap columns-select shipment-caret">
                                                    <Form.Item
                                                        label="Project "
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
                                                            onChange={(value) => {
                                                                list(value)
                                                                onChange('project_id', value)
                                                            }}
                                                        >
                                                            {Array.isArray(projects) &&
                                                                projects.map((project) => {
                                                                    return (
                                                                        <Select.Option key={project.project_id} value={project.project_id}
                                                                        >
                                                                            {project.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div class="linewrap d-flex">
                                        <span class="d-block me-4">Material</span>
                                        <hr />
                                    </div>
                                    <div class="row">
                                        <div class="col-12 space-col-spc mb-3">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    label="Scope Of Work"
                                                    for="name"
                                                    name="description"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter Scope Of Work",
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea rows={4} cols={50} placeholder="Scope Of Work" onChange={(e) => onChange('material_details', { description: e.target.value }, 0)} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div class="row space-col-spc mb-0">
                                            <div class="col-sm-4">
                                                <div className="wrap-box">
                                                    <Form.Item
                                                        label="Date"
                                                        name="date"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please enter date",
                                                            },
                                                        ]}
                                                    >
                                                        <Input onChange={({ target: { value } }) => onChange('material_details', { date: value }, 0)} type="date"></Input>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div className="wrap-box">
                                                    <Form.Item
                                                        label="Amount"
                                                        for="name"
                                                        name="amount"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please enter Amount",
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Amount" onChange={({ target: { value } }) => onChange('material_details', { amount: value }, 0)} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            {formData.shipment_type === 'project related' && (
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
                                                            <Select id="singlesa" onChange={(value) => onChange('material_details', { project_site_id: value }, 0)} class="js-states form-control file-wrap-select">
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
                                        </div>
                                        <div className="create-another minuswrap-img">
                                            <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="space-unit">
                                                {
                                                    formData.material_details.slice(1).map((data, index) => {
                                                        return <div className="row">
                                                            
                                                            {
                                                                Object.keys(data).map((key) => {
                                                                    let upperKey = key.charAt(0).toUpperCase() + key.slice(1);
                                                                    if (key.includes('_')) {
                                                                        upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                                                    }
                                                                    if (key === "amount") {
                                                                        return (
                                                                            <div key={key} className="wrap-box col-sm-3">
                                                                                <Form.Item
                                                                                    label={upperKey}
                                                                                    rules={[{ required: true, message: `Please enter ${upperKey}` }]}
                                                                                >
                                                                                    <Input
                                                                                        placeholder={upperKey}
                                                                                        value={data[key]}
                                                                                        name={key + index}
                                                                                        onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                                                    />
                                                                                </Form.Item>
                                                                            </div>
                                                                        )
                                                                    } else if (key === 'description') {
                                                                        return (
                                                                            <div key={key} className="wrap-box col-12">
                                                                                <Form.Item
                                                                                    label={"Scope Of Work"}
                                                                                    rules={[{ required: true, message: `Please enter Scope Of Work` }]}
                                                                                >
                                                                                    <Input.TextArea
                                                                                        rows={4}
                                                                                        cols={50}
                                                                                        placeholder={"Enter Scope Of Work"}
                                                                                        value={data[key]}
                                                                                        name={key + index}
                                                                                        onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                                                    />
                                                                                </Form.Item>
                                                                            </div>
                                                                        )
                                                                    } else if (key === 'date') {
                                                                        return (

                                                                            <div className="col-sm-4">
                                                                                <div className="wrap-box">
                                                                                    <Form.Item
                                                                                        label={upperKey}
                                                                                        rules={[
                                                                                            {
                                                                                                required: true,
                                                                                                message: "Please enter date",
                                                                                            },
                                                                                        ]}
                                                                                    >
                                                                                        <Input type="date"
                                                                                            placeholder={upperKey}
                                                                                            value={data[key]}
                                                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                                                        ></Input>
                                                                                    </Form.Item>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    } else if (key === 'project_site_id' && formData.shipment_type === 'project related') {
                                                                        return (
                                                                            <div class="col-sm-4">
                                                                                <div className="selectwrap columns-select shipment-caret ">
                                                                                    <Form.Item
                                                                                        label="Select Site"
                                                                                        name={`project_site_id_${index + 1}`}
                                                                                        htmlFor="file"
                                                                                        class="same-clr"
                                                                                    >
                                                                                        <Select id="singlesa" defaultValue={formData.material_details[0].project_site_id} onChange={(value) => onChange('material_details', { [key]: value }, index + 1)} class="js-states form-control file-wrap-select">
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
                                                                        )
                                                                    }
                                                                    return 
                                                                })
                                                            }
                                                            <MinusOutlined className="minus-wrap" onClick={() => {
                                                                setFormData({
                                                                    ...formData,
                                                                    material_details: [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]
                                                                });
                                                            }} style={{ marginLeft: '8px' }} />
                                                        </div>
                                                    })
                                                }
                                                <Form.Item>
                                                    <Button className="ant-btn css-dev-only-do-not-override-p7e5j5 ant-btn-dashed add-more-btn add-space-btn" type="dashed" onClick={() => {
                                                        setFormData({
                                                            ...formData,
                                                            material_details: [...formData.material_details, {
                                                                ...repeatorData,
                                                                project_site_id: formData.material_details[0].project_site_id
                                                            }]
                                                        });
                                                    }} icon={<PlusOutlined />}>
                                                        Add More Material
                                                    </Button>
                                                </Form.Item>
                                            </Space>
                                        </div>
                                    </div>
                                    <div className="row top-btm-space mb-0">
                                        <div className="col-lg-4 col-md-6">
                                            <div class="wrap-box">
                                                <Form.Item
                                                    name='hst_amount'
                                                    label="HST Amount"
                                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                                >
                                                    <Input readOnly placeholder="HST Amount" />
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
                                                    <Input readOnly placeholder="Total Amount" />
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

export default CreateSubContractorPo;