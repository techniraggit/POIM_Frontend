import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import {PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { fetchPo, fetchProjects, fetchVendorContact, fetchVendorContacts } from "@/apis/apis/adminApis";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import moment from "moment";

const { Option } = Select;

const repeatorData = {
    quantity: '',
    unit_price: 0,
    amount: 0,
    description: '',
    material_for: '',
    code: '',
    project_id: '',
    project_site_id: ''
}

const EditPo = () => {
    const [repeator, setRepeator] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [contactId, setContactId] = useState('');
    const [projects, setProjects] = useState([]);
    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;
    const [userName, setUserName] = useState({
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        const response = fetchVendorContact();
        response.then((res) => {
            if(res?.data?.status) {
                setVendors([...res.data.vendors]);
            }
        })
        fetchPo(id).then((res) => {
            if(res?.data?.status) {
                const data = res.data.data;
                fetchVendorContactDropdown(data.vendor_contact.company.vendor_id)
                form.setFieldValue('po_type', data.po_type);
                form.setFieldValue('amount', data.total_amount);
                form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                form.setFieldValue('vendor_id', data.vendor_contact.company.vendor_id);
                form.setFieldValue('vendor_contact_id', data.vendor_contact.vendor_contact_id);
                form.setFieldValue('shipment_type', data.shipment_type);
                form.setFieldValue('hst_amount', data.hst_amount);
                form.setFieldValue('total_amount', data.total_amount);
                form.setFieldValue('project_site_id', data.project_site);
                form.setFieldValue('poDate', moment(data.po_date));
                form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                form.setFieldValue('country', data.vendor_contact.company.country);
                form.setFieldValue('state', data.vendor_contact.company.state);
                form.setFieldValue('address', data.vendor_contact.company.address);
                form.setFieldValue('phone', data.vendor_contact.phone_number);
                form.setFieldValue('email', data.vendor_contact.email);
                form.setFieldValue('poNumber', data.po_number)
                form.setFieldValue('shipment_type', data.shipment_type)
                form.setFieldValue('delivery_address', data.delivery_address)
            }
        });
        setUserName({
            firstName: localStorage.getItem('user_first_name'),
            lastName: localStorage.getItem('user_last_name')
        })
    }, []);

    useEffect(() => {
        if (form.getFieldValue('shipment_type') === 'project related' || form.getFieldValue('shipment_type') === 'combined') {
            const response = fetchProjects();
            response.then((res) => {
                if(res?.data?.status) {
                    setProjects(res.data.projects);
                }
            });
        }
    }, [form.getFieldValue('shipment_type')]);

    const fetchVendorContactDropdown = (id) => {
        const response = fetchVendorContacts(id);
        response.then((res) => {
            if(res?.data?.status) {
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

    const handleUnitPriceRepeaterChange = () => {
        const totalAmount = getTotalAmount();
        // form.setFieldsValue({ HST_Amount: totalAmount * 0.13 });
        // form.setFieldsValue({ Total_amount: totalAmount * 0.13 + totalAmount });
    };

    const handleRepeatorChange = (value, name, index) => {
        const values = repeator[index];
        if (values) {
            repeator[index] = {
                ...repeator[index],
                [name]: value
            }

            if(repeator[index].quantity && repeator[index].unit_price) {
                repeator[index] = {
                    ...repeator[index],
                    amount: parseFloat(repeator[index].quantity) * parseFloat(repeator[index].unit_price)
                }
            }
        }
        if(name === 'unit_price' || name === 'quantity') {
            // handleUnitPriceRepeaterChange();
        }
        setRepeator([...repeator]);
    }

    const onFinish = (values) => {
        console.log(values);
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
                                <span>Edit Purchase Order</span>
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
                                            >
                                                <Input readOnly />
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
                                                            {names.map((entry) =>(
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
                                                    <Input />
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
                                                    <Input />
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
                                                    <Input />
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
                                                    <Input />
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
                                                    <Input />
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
                                                    <Input />
                                                </Form.Item>
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
                                                        onChange={() => {}}
                                                    >
                                                        <Option value="project related">Project Related</Option>
                                                        <Option value="nnn project related">Non Project Related</Option>
                                                        <Option value="combined">Combined</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            {form.getFieldValue('shipment_type') === 'project related' && (
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
                                            {form.getFieldValue('shipment_type') === 'non project related' && (
                                                <div class="selectwrap non-project-wrap">

                                                    <Form.Item
                                                        label="Delivery Address"
                                                        name="delivery_address"
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

export default EditPo;