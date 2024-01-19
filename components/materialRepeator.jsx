import React, { useEffect } from "react";
import '../styles/style.css';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Space } from "antd";

const repeatorData = {
    quantity: '',
    unit_price: '',
    description: '',
    code: '',
    material_for: '',
    amount: 0,
    project_site_id: '',
    site_id: ''
}

function MaterialRepeator({ onChange, siteOptions, formData, setFormData, projects, form, edit }) {
    // useEffect(() => {
    //     if (edit) {
    //         form.setFieldValue('start_date', formData.material_details[0]?.start_date);
    //         form.setFieldValue('end_date', formData.material_details[0]?.end_date);
    //     }
    // }, [formData.material_details[0]?.start_date, edit, formData.material_details[0]?.end_date]);

    return (
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
                        <Input placeholder="Amount" onChange={({ target: { value } }) => onChange('material_details', { quantity: value }, 0)} />
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
                        <Input placeholder="Amount" onChange={({ target: { value } }) => onChange('material_details', { unit_price: value }, 0)} />
                    </Form.Item>

                </div>
            </div>
            <div class="col-sm-4">
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
                        <Input placeholder="Amount"
                            readOnly
                        // onChange={({ target: { value } }) => onChange('material_details', { amount: value }, 0)} 
                        />
                    </Form.Item>

                </div>
            </div>
            <div class="row space-col-spc mb-0">
                <div class="col-sm-4">
                    <div className="wrap-box mb-0">
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
                            <Input placeholder="Amount" onChange={({ target: { value } }) => onChange('material_details', { description: value }, 0)} />
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

                {(formData.shipment_type === 'Non Project Related' || formData.shipment_type === 'Combined') && (
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
                                <Select id="single90"
                                    class="js-states form-control file-wrap-select"
                                    onChange={(value) => onChange('material_details', { material_for: value }, 0)}
                                >
                                    {formData.shipment_type === 'Combined' && <option value="project">Project</option>}
                                    <Option value="inventory">Inventory</Option>
                                    <Option value="supplies">Supplies/Expenses</Option>

                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )}
                <div className="col-md-4">
                    <div className="wrap-box">
                        {formData.material_details[0].material_for === 'inventory' && (
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
                        {formData.material_details[0].material_for === 'supplies' && (
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
                        {formData.material_details[0].material_for === 'project' && (
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
            </div>



            <div className="create-another minuswrap-img">
                <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="space-unit">
                    {
                        formData.material_details.slice(1).map((data, index) => {
                            return <div className="row">

                                {
                                    Object.keys(data).map((key) => {
                                        let upperKey = key.charAt(0).toUpperCase() + key.slice(1);
                                        console.log(key === 'material_for' && (formData.shipment_type === 'Non Project Related' || formData.shipment_type === 'Combined'), 'formData');
                                        if (key.includes('_')) {
                                            upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                        }
                                        if (key === "quantity") {
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
                                        }
                                        else if (key === 'unit_price') {
                                            return (
                                                <div key={key} className="wrap-box col-12">
                                                    <Form.Item
                                                        label={"Unit price"}
                                                        rules={[{ required: true, message: `Please enter Scope Of Work` }]}
                                                    >
                                                        <Input
                                                            placeholder={upperKey}
                                                            value={data[key]}
                                                            name={key + index}
                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                        />
                                                        {/* <Input.TextArea
                                                            rows={4}
                                                            cols={50}
                                                            placeholder={"Enter Scope Of Work"}
                                                            value={data[key]}
                                                            name={key + index}
                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                        /> */}
                                                    </Form.Item>
                                                </div>
                                            )
                                        }
                                        else if (key === 'amount') {
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
                                                            <Input
                                                                // type="date"
                                                                placeholder={upperKey}
                                                                value={data[key]}
                                                                onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                            ></Input>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if (key === 'description') {
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
                                                            <Input
                                                                // type="date"
                                                                placeholder={upperKey}
                                                                value={data[key]}
                                                                onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                            ></Input>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        else if (key === 'project_site_id' && formData.shipment_type === 'project related') {
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
                                        else if (key === 'project_site_id' && formData.shipment_type === 'project related') {
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
                                        } else if (key === 'material_for' && (formData.shipment_type === 'Non Project Related' || formData.shipment_type === 'Combined')) {
                                            return (
                                                <div class="col-sm-4 ">
                                                    <div className="selectwrap add-dropdown-wrap shipment-caret">
                                                        <Form.Item
                                                            label="Material For"
                                                            name={`material_for_${index + 1}`}
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
                                                                onChange={(value) => onChange('material_details', { material_for: value }, 0)}
                                                            >
                                                                {formData.shipment_type === 'Combined' && <option value="project">Project</option>}
                                                                <Option value="inventory">Inventory</Option>
                                                                <Option value="supplies">Supplies/Expenses</Option>

                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )

                                        } 
                                        else if (key === 'code' && (formData.material_details[0].material_for === 'inventory')) {
                                            return(
                                                <Form.Item
                                                label="Inventory Code"
                                                name={`code_${index + 1}`}
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
                                            )
                                            
                                        }
                                        else if (key === 'code' && (formData.material_details[0].material_for === 'supplies')) {
                                            return(
                                                <Form.Item
                                                label="GL Code"
                                                name={`code_${index + 1}`}
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
    )
}

export default MaterialRepeator;