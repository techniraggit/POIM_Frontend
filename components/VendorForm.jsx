import React from "react";
import { Form, Input, Button, Space, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { updateVendor } from "@/apis/apis/adminApis";

function VendorForm({ form, onFinish, onChange, setFormData, repeatorData, formData }) {
    const handleRemoveContact = (id, index) => {
        updateVendor({ vendor_contact_id: id }).then((response) => {
            if (response?.data?.status) {
                message.success('Vendor Contact removed');
                setFormData({
                    ...formData,
                    contact_info: [...formData.contact_info.slice(0, index + 1), ...formData.contact_info.slice(index + 1 + 1)]
                });
            }
        })
    }

    return (
        <Form onFinish={onFinish} layout="vertical" form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <div className="row">

                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Company Name"
                            name="company_name"
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your company name!' }]}
                        >
                            <Input value={formData.company_name} onChange={({ target: { value } }) => onChange('company_name', value)} />
                        </Form.Item>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Contact Person Name"
                            name="name"
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your contact person name!' }]}
                        >
                            <Input
                                value={formData.contact_info[0]?.name} onChange={({ target: { value } }) => onChange('contact_info', { name: value }, 0)} />
                        </Form.Item>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                    <Form.Item
                          label="Contact No"
                          name="phone_number"  // Add a name to link the input to the form values
                          className="vender-input"
                          rules={[
                            { required: true, message: 'Please enter your contact number!' },
                            {
                              pattern: /^[0-9]{10}$/, // Pattern for +91XXXXXXXXXX or +1XXXXXXXXXX
                              message: 'Please enter a valid 10 digit phone number',
                            },
                           
                          ]}
                        
                        >
                            <Input value={formData.contact_info[0]?.phone_number}
                                onChange={({ target: { value } }) => onChange('contact_info', { phone_number: value }, 0)}
                                addonBefore="+1"
                            />
                        </Form.Item>
                    </div>
                </div>


                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Email Address"
                            name="email"
                            // Add a name to link the input to the form values
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your email address!' }]}
                        >
                            <Input value={formData.contact_info[0]?.email} onChange={({ target: { value } }) => onChange('contact_info', { email: value }, 0)} />
                        </Form.Item>
                    </div>
                </div>


                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="State / Province"
                            name="state"  // Add a name to link the input to the form values
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your State / Province!' }]}
                            initialValue='Ontario'
                        >
                            <Input readOnly />
                        </Form.Item>
                    </div>
                </div>

                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Country"
                            name="country"  // Add a name to link the input to the form values
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your country!' }]}
                            initialValue='Canada'
                        >
                            <Input readOnly />
                        </Form.Item>
                    </div>
                </div>

                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Address"
                            name="address"  // Add a name to link the input to the form values
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your  address!' }]}
                        >
                            <Input value={formData.address} onChange={({ target: { value } }) => onChange('address', value)} />
                        </Form.Item>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="City"
                            name="city"  // Add a name to link the input to the form values
                            className="vender-input"
                        >
                            <Input value={formData.city} onChange={({ target: { value } }) => onChange('city', value)} />
                        </Form.Item>
                    </div>
                </div>
                <div className="create-another">
                    {
                        formData.contact_info.slice(1).map((contact, index) => {
                            return (
                                <div className="row" style={{ display: 'flex', marginBottom: 8 }}>
                                    {
                                        Object.keys(contact).map((key) => {
                                            let upperKey = key.charAt(0).toUpperCase() + key.slice(1);
                                            if (key.includes('_')) {
                                                upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                            }
                                            if (key === 'phone_number') {
                                                return (
                                                    // <div className="col-sm-4">
                                                    <div key={key} className="wrap-box mb-0 col-lg-3 col-md-12">
                                                        <Form.Item
                                                            label={"Phone Number"}
                                                            name={key + index}
                                                            rules={[ { required: true, message: 'Please enter your contact number!' },
                                                            {
                                                              pattern: /^[0-9]{10}$/, // Pattern for +91XXXXXXXXXX or +1XXXXXXXXXX
                                                              message: 'Please enter a valid 10 digit phone number',
                                                            },
                                                            {
                                                                validator(_, value) {
                                                                    const otherAddresses = formData.contact_info
                                                                        .filter((_, i) => i !== index + 1)
                                                                        .map((otherSite) => otherSite[key]);
                                                                    if (otherAddresses.includes(value)) {
                                                                        return Promise.reject(`${upperKey} must be unique.`);
                                                                    }

                                                                    return Promise.resolve();
                                                                },
                                                            }
                                                            ]}
                                                        >
                                                            <Input
                                                                placeholder={upperKey}
                                                                value={contact[key]}
                                                                addonBefore="+1"
                                                                onChange={({ target: { value, name } }) => {
                                                                    onChange('contact_info', { [key]: value }, index + 1)
                                                                }
                                                            }
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    // </div>
                                                )
                                            }
                                            else if (key !== 'company' && key !== 'vendor_contact_id' && key !== 'id') {
                                                return (
                                                    <div className="wrap-box mb-0 col-lg-3 col-md-12">
                                                        <Form.Item
                                                            label={upperKey}
                                                            name={key + index}
                                                            rules={[{ required: true, message: `Please enter ${upperKey}` },
                                                            (key === 'email') && {
                                                                validator(_, value) {
                                                                    const otherAddresses = formData.contact_info
                                                                        .filter((_, i) => i !== index + 1)
                                                                        .map((otherSite) => otherSite[key]);

                                                                    if (otherAddresses.includes(value)) {
                                                                        return Promise.reject(`${upperKey} must be unique.`);
                                                                    }

                                                                    return Promise.resolve();
                                                                },
                                                            },
                                                            ]}
                                                        >
                                                            <Input value={contact[key]} onChange={({ target: { value } }) => onChange('contact_info', { [key]: value }, index + 1)} placeholder={upperKey} />
                                                        </Form.Item>
                                                    </div>
                                                )
                                            }
                                            return <></>
                                        })
                                    }
                                    <MinusOutlined className="minus-wrap col-lg-1"
                                        onClick={() => {
                                            if (contact.vendor_contact_id) {
                                                handleRemoveContact(contact.vendor_contact_id, index);
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    contact_info: [...formData.contact_info.slice(0, index + 1), ...formData.contact_info.slice(index + 1 + 1)]
                                                });
                                            }
                                        }} style={{ marginLeft: '8px' }} />
                                </div>
                            )
                        })
                    }
                    <Form.Item>
                        <Button className="add-more-btn" type="dashed" onClick={() => {
                            setFormData({
                                ...formData,
                                contact_info: [...formData.contact_info, {
                                    ...repeatorData
                                }]
                            });
                        }} icon={<PlusOutlined />}>
                            <span >Add Another Contact Person</span>
                        </Button>
                    </Form.Item>
                </div>
                <Form.Item>
                    <button type="submit" className="create-ven-butt" loading>Submit</button>
                </Form.Item>
            </div>
        </Form>
    )
}

export default VendorForm;
