import React , { useEffect, useState }from "react";
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { fetchPo, fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, getVendorDetails, updatePo } from "@/apis/apis/adminApis";
import { Form, Input, Select, DatePicker, Space } from "antd";
import moment from "moment";


// import { fetchProjectSites, fetchProjects, fetchVendorContact, fetchVendorContacts, updatePo } from "@/apis/apis/adminApis";
// import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";

const { Option } = Select;


const Subcontractor_invoice = ({data}) => {


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
        material_details: []
    });

    const [contactId, setContactId] = useState('');
    const [projects, setProjects] = useState([]);
    const [siteOptions, setSiteOptions] = useState([]);
    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;

    useEffect(() => {
        form.setFieldValue('po_type', 'subcontractor');
        const response = fetchVendorContact();
        response.then((res) => {
            if (res?.data?.status) {
                setVendors([...res.data.vendors]);
            }
        })
       if(data){
        if (data?.status) {
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
            form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
            form.setFieldValue('first_name', data.created_by.first_name)
            form.setFieldValue('last_name', data.created_by.last_name)
        }
       }
    }, []);

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
            return total + item.amount;
        }, 0);

        return totalAmount;
    };

    const updateAmount = (amount, index) => {
        const details = formData.material_details[index];
        details.amount = amount || 0;
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
        form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) || 0 });
        form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
    };

    const vendorContactDetails = (id) => {
        const response = getVendorDetails(id)
        response.then((res) => {
            if (res.data?.status) {
                setFormData({
                    ...formData,
                    company_name: res.data.vendors.company.company_name,
                    email: res.data.vendors.email,
                    phone: res.data.vendors.phone_number,
                    address: res.data.vendors.company.address,
                    state: res.data.vendors.company.state,
                    country: res.data.vendors.company.country
                })
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
            if (value.amount) {
                updateAmount(index);
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
        if (value.amount || name === "amount") {
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
        if (formData.shipment_type === 'project related') {
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
                                    <Input placeholder="00854" value='00584' readOnly />
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
                            <div className="col-lg-4 col-md-6">
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
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div class="col-md-6 col-lg-12 all-wrap-box mb-3">
                                {formData.shipment_type === 'project related' && (
                                    <div className="col-lg-6">
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
                        </div>
                        <div class="linewrap d-flex">
                            <span class="d-block me-4">Material</span>
                            <hr />
                        </div>
                        <div class="row">

                            <div class="col-sm-4 space-col-spc">
                                <div class="wrap-box">
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
                                        <Input readOnly placeholder="Description" onChange={(e) => onChange('description', { project_site_id: value }, 0)} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div class="col-sm-4 space-col-spc">
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
                                        <Input readOnly onChange={({ target: { value } }) => onChange('material_details', { date: value }, 0)} type="date"></Input>
                                    </Form.Item>
                                </div>
                            </div>
                            <div class="row space-col-spc mb-0">
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
                                            <Input readOnly placeholder="Amount" onChange={({ target: { value } }) => onChange('material_details', { amount: value }, 0)} />
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
                                                <Select disabled id="singlesa" onChange={(value) => onChange('material_details', { project_site_id: value }, 0)} class="js-states form-control file-wrap-select">
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
                                                        if (key === 'description' || key === "amount") {
                                                            return (
                                                                <div key={key} className="wrap-box col-sm-3">
                                                                    <Form.Item
                                                                        label={upperKey}
                                                                        rules={[{ required: true, message: `Please enter ${upperKey}` }]}
                                                                    >
                                                                        <Input
                                                                            disabled
                                                                            placeholder={upperKey}
                                                                            value={data[key]}
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
                                                                            <Input readOnly type="date"
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
                        <div className="row top-btm-space mb-0 mt-4">
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
export default Subcontractor_invoice