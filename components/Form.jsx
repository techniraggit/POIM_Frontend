'use client'
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import { Form, Input, Select, DatePicker } from "antd";
import { fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, getVendorDetails } from "@/apis/apis/adminApis";
import moment from "moment";
import SubcontractorRepeator from "./SubcontractorRepeator";
import RentalRepeator from "./rentalRepeator";
import MaterialRepeator from "./materialRepeator";
import { useGlobalContext } from "@/app/Context/UserContext";

const { Option } = Select;

function PoForm({ onChange, formData, form, isNew, setFormData, edit }) {
    const [contactId, setContactId] = useState('');
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const [vendors, setVendors] = useState([]);
    const { user } = useGlobalContext();

    useEffect(() => {
        form.setFieldValue('po_type', formData.po_type);
        form.setFieldValue('poDate', moment());
        const response = fetchVendorContact();
        response.then((res) => {
            if (res?.data?.status) {
                setVendors([...res.data.vendors]);
                setFormData({
                    ...formData,
                    po_date: moment().format('YYYY-MM-DD')
                })
            }
        });

        if (edit) {
            fetchSites();
        }
        console.log(user, 'firstname');

    }, []);
    useEffect(() => {
        form.setFieldValue('first_name', user.first_name)
        form.setFieldValue('last_name', user.last_name)

    }, [user])

    useEffect(() => {
        if (edit) {
            fetchVendorContactDropdown(formData.vendor_id);
        }
    }, [formData.vendor_id])

    useEffect(() => {
        if ((form.getFieldValue('shipment_type') === 'project related') || (form.getFieldValue('shipment_type') === 'combined')) {
            const response = fetchProjects();
            response.then((res) => {
                if (res?.data?.status) {
                    setProjects(res.data.projects);
                }
            });
        }
    }, [form.getFieldValue('shipment_type')]);

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

    const fetchVendorContactDropdown = (id) => {
        const response = fetchVendorContacts(id);
        response.then((res) => {
            if (res?.data?.status) {
                setContactId([...res.data.vendors])
            }
        })
    }

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

    const names = vendors?.map((vendor) => {
        return {
            vendorId: vendor.vendor_id,
            company_name: vendor.company_name,
        };
    });

    return (
        <>
            <div class="order-choose d-flex">
                <div className="left-wrap wrap-number sub-po-typee">
                    <Form.Item
                        label="Purchase Order Number"
                        name="poNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter Purchase Order Number',
                            },
                            {
                                pattern: /^\d{6,}$/, // Regular expression to ensure at least six digits
                                message: 'Purchase Order Number must be at least six digits',
                            },
                        ]}
                    >
                        <Input placeholder="Enter Po Number" onChange={({ target: { value } }) => onChange('po_number', value)} readOnly={isNew} />
                    </Form.Item>
                </div>

                <div className="left-wrap wrap-number" id="forspce">
                    <Form.Item
                        label="Date"
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
                            disabled={isNew}
                            onChange={(date) => onChange('po_date', date)}
                            placeholder="Select Date"
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
                <div class="col-md-6 col-lg-4">
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
                                {formData.po_type !== 'rental' && <Option value="non project related">Non Project Related</Option>}
                                {formData.po_type !== 'rental' && <Option value="combined">Combined</Option>}
                                {/* <Option value="Non Project Related">Non Project Related</Option>
                                <Option value="Combined">Combined</Option> */}
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
                {formData.shipment_type === 'non project related' && (
                    <div class="col-md-6 col-lg-4">
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
                    </div>
                )}
            </div>
            <div class="linewrap d-flex">
                <span class="d-block me-4">Details</span>
                <hr />
            </div>
            {
                formData.po_type === 'subcontractor' ? <SubcontractorRepeator formData={formData} edit={edit} siteOptions={siteOptions} setFormData={setFormData} form={form} onChange={onChange} /> : <></>
            }
            {
                formData.po_type === 'rental' ? <RentalRepeator formData={formData} edit={edit} siteOptions={siteOptions} setFormData={setFormData} form={form} onChange={onChange} /> : <></>
            }
            {
                formData.po_type === 'material' ? <MaterialRepeator formData={formData} edit={edit} siteOptions={siteOptions} list={list} projects={projects} setFormData={setFormData} form={form} onChange={onChange} /> : <></>
            }
            <div className="row top-btm-space mb-0">
                <div className="col-lg-4 col-md-6">
                    <div class="wrap-box">
                        <Form.Item
                            name='hst_amount'
                            label="HST Amount"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input 
                            addonBefore="$"
                            readOnly placeholder="HST Amount" />
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
                            <Input
                            addonBefore="$"
                             readOnly placeholder="Total Amount" />
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
        </>
    )
}
export default PoForm;