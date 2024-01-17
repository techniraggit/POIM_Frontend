import React, {useState,useEffect}from "react";
import { useRouter } from "next/router";
import moment from "moment";


import { fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, updatePo } from "@/apis/apis/adminApis";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";


const Material_invoice = ({data}) => {

    const [vendors, setVendors] = useState([]);
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
        delivery_address: '',
        quantity: 0,
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
            if(res?.data?.status) {
                setVendors([...res.data.vendors]);
            }
        });
        if(data){
            if(data?.status) {
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
                    delivery_address: data.delivery_address || '1860 Shawson',
                    material_details: [...data.material_details]
                });
                form.setFieldValue('po_type', data.po_type);
                form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                form.setFieldValue('vendor_id', data.vendor_contact.company.vendor_id);
                form.setFieldValue('vendor_contact_id', data.vendor_contact.vendor_contact_id);
                form.setFieldValue('shipment_type', data.shipment_type);
                form.setFieldValue('hst_amount', (data.hst_amount).toFixed(2));
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
                form.setFieldValue('delivery_address', data.delivery_address || '1860 Shawson')
                form.setFieldValue('quantity', data.material_details[0]?.quantity)
                form.setFieldValue('unit_price', data.material_details[0]?.unit_price)
                form.setFieldValue('amount', data.material_details[0]?.amount)
                form.setFieldValue('description', data.material_details[0]?.description)
                form.setFieldValue('material_for', data.material_details[0]?.material_for)
                form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                form.setFieldValue('code', data.material_details[0]?.code)
                form.setFieldValue('material_delivery', data.material_details[0]?.delivery_address || '1860 Shawson')
                form.setFieldValue('first_name', data.created_by.first_name)
                form.setFieldValue('last_name', data.created_by.last_name)
            }
        }
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
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + item.amount;
        }, 0);

        return totalAmount;
    };

    const updateAmount = (quantity, unitPrice, index) => {
        const calculatedAmount = quantity * unitPrice;
        const details = formData.material_details[index];
        details.amount = calculatedAmount || 0;
        formData.material_details[index] = details;
        setFormData({
            ...formData
        })
    };

    const handleUnitPriceRepeaterChange = () => {
        const totalAmount = getTotalAmount();
        setFormData({
            ...formData,
            hst_amount: totalAmount * 0.13,
            total_amount: totalAmount * 0.13 + totalAmount
        })
        form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) });
        form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) });
    };

    const onFinish = () => {
        updatePo({
            ...formData,
            po_id: id,
            project_site_id: formData.project_site_id?.site_id
        }).then((res) => {
            if(res?.data?.status) {
                router.push('/po_list');
            }
        });
    }
    
    const onChange = (name, value, index) => {
        if(name === 'material_details') {
            const materialDetails = formData.material_details;
            Object.keys(value).map((key) => {
                materialDetails[index][key] = value[key];
            });
            if(value.unit_price) {
                updateAmount(materialDetails[index].quantity, value.unit_price, index);
            } else if(value.quantity) {
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
        if(value.unit_price || value.quantity || name === 'unit_price' || name === 'quantity') {
            handleUnitPriceRepeaterChange();
        }
    }

    const fetchSites = () => {
        const response = fetchProjectSites();

        response.then((res) => {
            if(res?.data?.status) {
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
                                                disabled
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
                                                disabled
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
                                        <Select disabled id="single3" placeholder="Select" class="js-states form-control file-wrap-select"
                                            onChange={(value) => { onChange('shipment_type', value) }}
                                        >
                                            <Option value="project related">Project Related</Option>
                                            <Option value="non project related">Non Project Related</Option>
                                            <Option value="combined">Combined</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                {formData.shipment_type === 'project related' && (
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
                                            <Select disabled id="single456"
                                                class="js-states form-control file-wrap-select"
                                                onChange={(value) => {
                                                    list(value)
                                                    onChange('project_id', value)
                                                }}
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
                                {formData.shipment_type === 'non project related' && (
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
                            <div class="col-sm-4 space-col-spc mb-0">
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
                                        <Input readOnly placeholder="Quantity" onChange={(e) => onChange('quantity', e.target.value)} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div class="col-sm-4 space-col-spc mb-0">
                                <div class="wrap-box ">
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
                                        <Input readOnly placeholder="Unit Price" onChange={(e) => onChange('unit_price', e.target.value)} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div class="col-sm-4 space-col-spc mb-0">
                                <div class="wrap-box">
                                    <Form.Item
                                        label="Amount"
                                        for="name"
                                        name="amount"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter amount",
                                            },
                                        ]}
                                    >
                                        <Input readOnly placeholder="Amount" />
                                    </Form.Item>

                                </div>
                            </div>
                            <div class="row space-col-spc mb-0">
                                <div class="col-sm-4">
                                    <div className="wrap-box">
                                        <Form.Item
                                            label="Description"
                                            for="name"
                                            name="description"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter description",
                                                },
                                            ]}
                                        >
                                            <Input readOnly placeholder="Description" onChange={({ target: { value } }) => onChange('description', value)} />
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
                                                <Select disabled id="singlesa" onChange={(value) => onChange('project_site_id', value)} class="js-states form-control file-wrap-select">
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
                                {formData.shipment_type === 'non project related' && (
                                    <div class="col-sm-4 ">
                                        <div className="selectwrap add-dropdown-wrap shipment-caret">
                                            <Form.Item
                                                label="Material For"
                                                name="material_for"
                                                htmlFor="file"
                                                class="same-clr"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please choose Material For",
                                                    },
                                                ]}
                                            >
                                                <Select disabled id="single90"
                                                    class="js-states form-control file-wrap-select"
                                                    onChange={(value) => { onChange('material_details', { material_for: value }, 0) }}
                                                >
                                                    <Option value="inventory">Inventory</Option>
                                                    <Option value="supplies">Supplies/Expenses</Option>

                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>
                                )}

                                {formData.shipment_type === 'combined' && (
                                    <div className="col-md-4">
                                        <div class="selectwrap add-dropdown-wrap">
                                            <div class="selectwrap columns-select shipment-caret select-sites">
                                                <Form.Item
                                                    label="Material For"
                                                    name="material_for"
                                                    htmlFor="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose material",
                                                        },
                                                    ]}
                                                >
                                                    <Select disabled id="single67" class="js-states form-control file-wrap-select"
                                                        onChange={(value) => { onChange('material_details', { material_for: value }, 0) }}
                                                    >
                                                        <Option value="projects">Project </Option>
                                                        <Option value="inventory">Inventory</Option>
                                                        <Option value="supplies">Supplies/Expenses</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="col-md-4">
                                    <div className="wrap-box">
                                        {formData.material_details[0]?.material_for === 'inventory' && (
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
                                                <Input readOnly onChange={({ target: { value } }) => onChange('material_details', { code: value }, 0)} />
                                            </Form.Item>
                                        )}
                                        {formData.material_details[0]?.material_for === 'supplies' && (
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
                                                <Input readOnly onChange={({ target: { value } }) => onChange('material_details', { code: value }, 0)} />
                                            </Form.Item>
                                        )}

                                        {formData.material_details[0]?.material_for === 'projects' && (
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
                                                            <Select disabled id="single406"
                                                                class="js-states form-control file-wrap-select"
                                                                onChange={(value) => {
                                                                    list(value);
                                                                    onChange('material_details', { project_id: value }, 0)
                                                                }}
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
                            </div>
                            <div className="row select-sitee">
                                <div className="col-md-4">
                                    {formData.material_details[0]?.material_for === 'projects' && (
                                        <div class="selectwrap add-dropdown-wrap">
                                            <div className="selectwrap columns-select shipment-caret ">
                                                <Form.Item
                                                    label="Select Site"
                                                    name="material_site_id"
                                                    htmlFor="file"
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose site",
                                                        },
                                                    ]}
                                                >
                                                    <Select disabled id="single51" onChange={(value) => onChange('material_details', { project_site_id: value }, 0)} class="js-states form-control file-wrap-select">
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
                                    {(formData.material_details[0]?.material_for === 'supplies' || formData.material_details[0]?.material_for === 'inventory') && (
                                        <>
                                            <div class="wrap-box">
                                                < Form.Item
                                                    label="Delivery Address"
                                                    name="material_delivery"
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
                                                    <Input disabled readOnly />
                                                </Form.Item>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="create-another minuswrap-img mt-0">
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
                                                        if (key === 'quantity' || key === 'unit_price' || key === 'description' || key === "amount") {
                                                            return (
                                                                <div key={key} className="wrap-box col-sm-3">
                                                                    <Form.Item
                                                                        label={upperKey}
                                                                        rules={[{ required: true, message: `Please enter ${upperKey}` }]}
                                                                    >
                                                                        <Input
                                                                            readOnly
                                                                            placeholder={upperKey}
                                                                            value={data[key]}
                                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                                        />
                                                                    </Form.Item>
                                                                </div>
                                                            )
                                                        } else if (key === 'material_for') {
                                                            return (
                                                                <div className="row">
                                                                    <div class="col-sm-4">
                                                                        {(formData.shipment_type === 'non project related' || formData.shipment_type === 'combined') && (
                                                                            <>
                                                                                <div className="material-for-wrap">
                                                                                    <label>Material For</label>
                                                                                    <select disabled placeholder="Select" className="js-states form-control custom-wrap-selector" onChange={({ target: { value } }) => {
                                                                                        onChange('material_details', { material_for: value }, index + 1)
                                                                                    }} value={formData.material_details[index + 1].material_for}>
                                                                                        {formData.shipment_type === 'combined' && <option value="project">Project</option>}
                                                                                        <option value="inventory">Inventory</option>
                                                                                        <option value="supplies">Supplies/Expenses</option>
                                                                                    </select>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className="col-sm-4">
                                                                        <div className="wrap-box">
                                                                            {(formData.material_details[index + 1].material_for === 'inventory' || formData.material_details[index + 1].material_for === 'supplies') && (
                                                                                <>
                                                                                    <label>{formData.material_details[index + 1].material_for === 'inventory' ? "Inventory Code" : "GL Code"}</label>
                                                                                    <input
                                                                                        readOnly
                                                                                        onChange={({ target: { value, name } }) => onChange('material_details', { code: value }, index + 1)}
                                                                                        value={formData.material_details[index + 1].code}
                                                                                    />
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        } else if (key === 'project') {
                                                            return (
                                                                formData.material_details[index + 1].material_for === 'projects' && (
                                                                    <div className="row">
                                                                        <div className="col-sm-4">
                                                                            <div class="top-project">
                                                                                <div class="selectwrap columns-select shipment-caret ">
                                                                                    <label>Project</label>
                                                                                    <select disabled className="js-states form-control custom-wrap-selector" onChange={({ target: { value } }) => {
                                                                                        list(value);
                                                                                        onChange('material_details', { project: value }, index + 1)
                                                                                    }
                                                                                    }
                                                                                        value={formData.material_details[index + 1].project}
                                                                                    >
                                                                                        {Array.isArray(projects) &&
                                                                                            projects.map((project) => (
                                                                                                <option key={project.project} value={project.project}>
                                                                                                    {project.name}
                                                                                                </option>
                                                                                            ))}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-4">
                                                                            {formData.material_details[index + 1].material_for === 'projects' && (
                                                                                <div class="selectwrap shipment-caret add-dropdown-wrap">
                                                                                    <div className="selectwrap columns-select shipment-caret ">
                                                                                        <label>Project Site</label>

                                                                                        <select disabled className="js-states form-control custom-wrap-selector" value={formData.material_details[index + 1].project_site_id} onChange={({ target: { value } }) => onChange('material_details', { project_site_id: value }, index + 1)}>
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
                                                                )
                                                            )
                                                        }
                                                        return <></>
                                                    })
                                                }
                                            </div>
                                        })
                                    }
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
                    </Form>
                </div>
            </div>
        </>

    )
}
export default Material_invoice