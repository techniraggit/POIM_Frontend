import React from "react";
import { Form, Input, Button, Select, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { removeProjectSite } from "@/apis/apis/adminApis";

function ProjectForm({ form, onFinish, onChange, managers, formData, setFormData, repeatorData, edit }) {
    return (
        <Form onFinish={onFinish} form={form} layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <div className="col-sm-4 mb-3">
                    <div className="wrap-box mb-2">
                        <Form.Item
                            label="Customer Name"
                            name="customer_name"
                            className="vender-input"
                            // rules={[{ required: true, message: 'Please enter customer name!' }]}
                        >
                            <Input onChange={({ target: { value } }) => onChange('customer_name', value)} />
                        </Form.Item>
                    </div>
                </div>
            <div className="row">
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Project Name"
                            name="project_name"
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your project name!' }]}
                        >
                            <Input onChange={({ target: { value } }) => onChange('project_name', value)} />
                        </Form.Item>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Project Number"
                            name="project_number"
                            className="vender-input"
                            // disabled={edit}
                            rules={[{ required: true, message: 'Please enter your project number!' }]}
                        >
                            <Input placeholder="ex.00854" 
                            readOnly={edit}
                            onChange={({ target: { value } }) => onChange('project_number', value)} />
                        </Form.Item>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-lg-4 col-md-12 shipment-caret">
                    <div className="selectwrap bg-border-select">
                        <Form.Item label="Project Manager" name="project_manager_id" initialValue="" 
                        className="vender-input"
                        rules={[{ required: true, message: 'Please choose project manager!' }]}
                        >
                            <Select onChange={(value) => onChange('project_manager_id', value)}>
                                {Array.isArray(managers) &&
                                    managers.map((manager) => (
                                        <Option key={manager.id} value={manager.id}
                                        >
                                            {manager.first_name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label="Address"
                            name="address0"
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your address!' }]}
                        >
                            <Input onChange={({ target: { value } }) => onChange('project_sites', { address: value }, 0)} />
                        </Form.Item>
                    </div>
                </div>
                <div className="col-lg-4 col-md-12">
                    <div className="wrap-box">
                        <Form.Item
                            label=" State"
                            name="state0"
                            className="vender-input"
                            rules={[{ required: true, message: 'Please enter your State!' }]}
                            initialValue='ON'
                        >
                            <Input onChange={({ target: { value } }) => onChange('project_sites', { state: value }, 0)} />
                        </Form.Item>
                    </div>
                </div>
            </div>

            <div className="create-another">
                {formData.project_sites.slice(1).map((site, index) => {
                    return <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        {
                            Object.keys(site).map((key) => {
                                let upperKey = 'Site ' + key.charAt(0).toUpperCase() + key.slice(1);
                                if (key.includes('_')) {
                                    upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                }
                                if (key !== 'site_id') {
                                    return (
                                        <div className="wrap-box mb-0">
                                            <Form.Item
                                                label={upperKey}
                                                name={key + (index + 1)}
                                                rules={[{ required: true, message: `Please enter ${upperKey}` },
                                                    key === 'address' && {
                                                        validator(_, value) {
                                                            const otherAddresses = formData.project_sites
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
                                                <Input onChange={({ target: { value } }) => onChange('project_sites', { [key]: value }, index + 1)} placeholder={upperKey} />
                                            </Form.Item>
                                        </div>
                                    )
                                }
                                return <></>
                            })
                        }
                        <MinusOutlined className="minus-wrap" onClick={() => {
                            if (site.site_id) {
                                removeProjectSite({ site_id: site.site_id }).then((response) => {
                                    if (response?.data?.status) {
                                        setFormData({
                                            ...formData,
                                            project_sites: [...formData.project_sites.slice(0, index + 1), ...formData.project_sites.slice(index + 1 + 1)]
                                        });
                                    }
                                })
                            } else {
                                setFormData({
                                    ...formData,
                                    project_sites: [...formData.project_sites.slice(0, index + 1), ...formData.project_sites.slice(index + 1 + 1)]
                                });
                            }
                        }} style={{ marginLeft: '8px' }} />
                    </Space>
                })}
                <Form.Item>
                    <Button className="add-more-btn" type="dashed" onClick={() => {
                        setFormData({
                            ...formData,
                            project_sites: [...formData.project_sites, {
                                ...repeatorData
                            }]
                        });
                        form.setFieldValue('state'+(formData.project_sites.length),'ON')
                    }} icon={<PlusOutlined />}>
                        <span >Add One More Site</span>
                    </Button>
                </Form.Item>
                
            </div>
            <Form.Item >
                <button type="submit" className="create-ven-butt" loading>Submit</button>
            </Form.Item>
        </Form>
    )
}

export default ProjectForm;
