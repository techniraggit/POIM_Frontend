import React, { useEffect } from "react";
import '../styles/style.css';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Space,message } from "antd";
import { updatematerialPo } from "@/apis/apis/adminApis";

const repeatorData = {
    quantity: '',
    unit_price: '',
    amount: 0,
    description: '',
    material_for: '',
    code: '',
    project_id: '',
    project_site_id: '',
}

function MaterialRepeator({ onChange, siteOptions, list, formData, setFormData, projects, calculateAmount, view }) {

    const handleRemoveDetail = (id, index) => {  
        updatematerialPo({md_id: id}).then((response) => {
            if(response?.data?.status) {
                message.success(response.data.message);
                setFormData({
                    ...formData,
                    material_details: [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]
                });
            }
        })
    }

    return (
        <div class="row">
            <div class="col-sm-4">
                <div class="wrap-box dollor-inputs">
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
                        <Input readOnly={view} placeholder="Quantity" onChange={({ target: { value } }) => onChange('material_details', { quantity: value }, 0)} />
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
                        <Input readOnly={view} placeholder="Unit Price" onChange={({ target: { value } }) => onChange('material_details', { unit_price: value }, 0)} />
                    </Form.Item>

                </div>
            </div>
            <div class="col-sm-4">
                <div class="wrap-box">
                    <Form.Item
                        label="Amount"
                        for="name"
                        name="amount0"
                        rules={[
                            {
                                required: true,
                                message: "Please enter amount",
                            },
                        ]}
                    >
                        <Input placeholder="Amount"
                            addonBefore="$"
                            readOnly
                        />
                    </Form.Item>

                </div>
            </div>
            <div class="row space-col-spc mb-0">
                <div class="col-sm-12">
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
                            {/* <Input placeholder="description"
                                onChange={({ target: { value } }) => onChange('material_details', 
                                { description: value }, 0)} /> */}
                                 <Input.TextArea 
                   placeholder="description" rows="4" cols="50"
                   onChange={({ target: { value } }) => onChange('material_details', 
                   { description: value }, 0)} />
                        </Form.Item>
                    </div>
                </div>
                {(formData.shipment_type === 'project related') && (
                    <div class="col-sm-4">
                        <div className="selectwrap columns-select shipment-caret ">
                            <Form.Item
                                label="Select Site"
                                name="project_site_id0"
                                htmlFor="file"
                                class="same-clr"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose site",
                                    },
                                ]}
                            >
                                <Select disabled={view} id="singlesa" onChange={(value) => onChange('material_details', { project_site_id: value }, 0)} class="js-states form-control file-wrap-select">
                                    {Array.isArray(siteOptions[0]) &&
                                        siteOptions[0].map((site) => (
                                            <Select.Option key={site.site_id} value={site.site_id}>
                                                {site.address}
                                            </Select.Option>
                                        )
                                        )}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )}

                {(formData.shipment_type?.toLowerCase() === 'non project related' || formData.shipment_type?.toLowerCase() === 'combined') && (
                    <div class="col-lg-4 col-md-6">
                        <div className="selectwrap add-dropdown-wrap shipment-caret">
                            <Form.Item
                                label="Material For"
                                name="material_for0"
                                htmlFor="file"
                                class="same-clr"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose Material For",
                                    },
                                ]}
                            >
                                <Select disabled={view} id="single90"
                                    class="js-states form-control file-wrap-select"
                                    onChange={(value) => onChange('material_details', { material_for: value }, 0)}
                                >
                                    {formData.shipment_type?.toLowerCase() === 'combined' && <option value="project">Project</option>}
                                    <Option value="inventory">Inventory</Option>
                                    <Option value="supplies">Supplies/Expenses</Option>

                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )}
                <div className="col-lg-4 col-md-6">
                    <div className="wrap-box">
                        {(formData.material_details[0].material_for?.toLowerCase() === 'inventory' || formData.material_details[0].material_for?.toLowerCase() === 'supplies') && (
                            <Form.Item
                                label={formData.material_details[0].material_for?.toLowerCase() === 'inventory' ? "Inventory Code" : "GL Code"}
                                name="code_0"
                                htmlFor="file"
                                className="same-clr"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter Inventory Code",
                                    },
                                ]}
                            >
                                <Input readOnly={view} onChange={({ target: { value } }) => onChange('material_details', { code: value },0)}/>
                            </Form.Item>
                        )}

                        {formData.material_details[0].material_for?.toLowerCase() === 'project' && (
                            <>
                                <div class="selectwrap add-dropdown-wrap">
                                    <div class="selectwrap columns-select shipment-caret ">
                                        <Form.Item
                                            label="Project"
                                            htmlFor="file"
                                            name="project_id0"
                                            class="same-clr"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please choose Project",
                                                },
                                            ]}
                                        >
                                            <Select id="single406"
                                                disabled={view}
                                                class="js-states form-control file-wrap-select"
                                                onChange={(value) => {
                                                    list(value, 0);
                                                    onChange('material_details', { project_id: value }, 0);
                                                }}
                                            >
                                                {Array.isArray(projects) &&
                                                    projects.map((project) => (
                                                        <Select.Option key={project.project_id}
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
            <div className="row">
                {formData.material_details[0].material_for?.toLowerCase() === 'project' && (
                    <div class="col-sm-4">
                        <div className="selectwrap columns-select shipment-caret ">
                            <Form.Item
                                label="Select Site"
                                name="project_site_id0"
                                htmlFor="file"
                                class="same-clr"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please choose site",
                                    },
                                ]}
                            >
                                <Select disabled={view} id="singlesa" onChange={(value) => onChange('material_details', { project_site_id: value }, 0)} class="js-states form-control file-wrap-select">
                                    {Array.isArray(siteOptions[0]) &&
                                        siteOptions[0].map((site) => (
                                            <Select.Option key={site.site_id} value={site.site_id}>
                                                {site.address}
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
                            return <div className="row align-items-center">
                                {
                                    Object.keys(data).map((key) => {
                                        let upperKey = key.charAt(0).toUpperCase() + key.slice(1);
                                        if (key.includes('_')) {
                                            upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                        }
                                        if (key === "quantity") {
                                            return (
                                                <div className="col-sm-4">
                                                    <div key={key} className="wrap-box">
                                                        <Form.Item
                                                            label={upperKey}
                                                            rules={[{ required: true, message: `Please enter ${upperKey}` }]}
                                                        >
                                                            <Input
                                                                readOnly={view}
                                                                placeholder={upperKey}
                                                                value={data[key]}
                                                                name={key + index}
                                                                onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        } else if (key === 'unit_price') {
                                            return (
                                                <div key={key} className="wrap-box col-sm-4">
                                                    <Form.Item
                                                        label={"Unit price"}
                                                        rules={[{ required: true, message: `Please enter unit price` }]}
                                                    >
                                                        <Input
                                                            readOnly={view}
                                                            placeholder={upperKey}
                                                            value={data[key]}
                                                            name={key + index}
                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            )
                                        } else if (key === 'amount') {
                                            return (
                                                <div className="col-sm-4">
                                                    <div className="wrap-box mb dollor-inputs">
                                                        <Form.Item
                                                            label={upperKey}
                                                            name={`amount` + (index + 1)}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter date",
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                readOnly={view}
                                                                addonBefore="$"
                                                                placeholder={upperKey}
                                                                value={data[key]}
                                                                onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                            ></Input>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        } else if (key === 'description') {
                                            return (
                                                <div className="col-sm-12">
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
                                                            <Input.TextArea
                                                                placeholder={upperKey}
                                                                rows="3" cols="40"
                                                                value={data[key]}
                                                                onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                              />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        } else if(key === 'project_id' && formData.material_details[index + 1].material_for?.toLowerCase() === 'project') {
                                            return(
                                                <div class="col-sm-4">
                                                    <div className="wrap-box">
                                            <div class="selectwrap add-dropdown-wrap kt">
                                            <div class="selectwrap columns-select shipment-caret ">
                                                <Form.Item
                                                    label="Project"
                                                    htmlFor="file"
                                                    name={"project_id" + (index + 1)}
                                                    class="same-clr"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please choose Project",
                                                        },
                                                    ]}
                                                >
                                                    <Select disabled={view} id="single406"
                                                        class="js-states form-control file-wrap-select"
                                                        onChange={(value) => {
                                                            list(value, index + 1);
                                                            onChange('material_details', { project_id: value }, index + 1);
                                                        }}
                                                    >
                                                            {Array.isArray(projects) &&
                                                                projects.map((project) => (
                                                                    <Select.Option key={project.project_id}
                                                                    >
                                                                        {project.name}
                                                                    </Select.Option>
                                                                ))}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                                </div>
                                                </div>
                                            </div>)
                                        } else if (key === 'project_site_id' && (formData.shipment_type?.toLowerCase() === 'project related')) {
                                            return (
                                                <div class="col-sm-4">
                                                    <div className="wrap-box">
                                                        <div className="selectwrap columns-select shipment-caret ">
                                                            <Form.Item
                                                                label="Select Site"
                                                                name={`project_site_id${index + 1}`}
                                                                htmlFor="file"
                                                                class="same-clr"
                                                            >
                                                                <Select disabled={view} id="singlesa" onChange={(value) => onChange('material_details', { [key]: value }, index + 1)} class="js-states form-control file-wrap-select">
                                                                    {Array.isArray(siteOptions[0]) &&
                                                                        siteOptions[0].map((site) => (
                                                                            <Select.Option key={site.site_id} value={site.site_id}>
                                                                                {site.address}
                                                                            </Select.Option>
                                                                        )
                                                                        )}
                                                                </Select>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (key === 'project_site_id' && formData.material_details[index + 1].material_for?.toLowerCase() === 'project') {
                                            return (
                                                <div class="col-sm-4">
                                                    <div className="wrap-box">
                                                        <div className="selectwrap columns-select shipment-caret ">
                                                            <Form.Item
                                                                label="Select Site"
                                                                name={`project_site_id${index + 1}`}
                                                                htmlFor="file"
                                                                class="same-clr"
                                                            >
                                                                <Select disabled={view} id="singlesa" onChange={(value) => onChange('material_details', { [key]: value }, index + 1)} class="js-states form-control file-wrap-select">
                                                                    {Array.isArray(siteOptions[index + 1]) &&
                                                                        siteOptions[index + 1].map((site) => (
                                                                            <Select.Option key={site.site_id} value={site.site_id}>
                                                                                {site.address}
                                                                            </Select.Option>
                                                                        )
                                                                        )}
                                                                </Select>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (key === 'material_for' && (formData.shipment_type?.toLowerCase() === 'non project related' || formData.shipment_type?.toLowerCase() === 'combined')) {
                                            return (
                                                <div class="col-lg-4 col-md-6">
                                                    <div className="wrap-box">
                                                        <div className="selectwrap add-dropdown-wrap shipment-caret">
                                                            <Form.Item
                                                                label="Material For"
                                                                name={'material_for' + (index + 1)}
                                                                htmlFor="file"
                                                                class="same-clr"
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Please choose Material For",
                                                                    },
                                                                ]}
                                                            >
                                                                <Select disabled={view} id="single90"
                                                                    class="js-states form-control file-wrap-select"
                                                                    value={formData.material_details[index + 1].material_for}
                                                                    onChange={(value) => onChange('material_details', { material_for: value }, index + 1)}
                                                                >
                                                                    {formData.shipment_type === 'combined' && <option value="project">Project</option>}
                                                                    <Option value="inventory">Inventory</Option>
                                                                    <Option value="supplies">Supplies/Expenses</Option>

                                                                </Select>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (key === 'code' && (formData.material_details[index + 1].material_for?.toLowerCase() === 'inventory')) {
                                            return (
                                                <div className="col-lg-4 col-md-6">
                                                    <div className="wrap-box">
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
                                                            <Input readOnly={view} defaultValue={formData.material_details[index + 1].code} onChange={({ target: { value } }) => onChange('material_details', { code: value }, index + 1)} />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        } else if (key === 'code' && (formData.material_details[index + 1].material_for?.toLowerCase() === 'supplies')) {
                                            return (
                                                <div className="col-sm-4">
                                                    <div className="wrap-box">
                                                        <Form.Item
                                                            label="GL Code"
                                                            name={`code_${index + 1}`}
                                                            htmlFor="file"
                                                            className="same-clr"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter GL Code",
                                                                },
                                                            ]}
                                                        >
                                                            <Input readOnly={view} defaultValue={formData.material_details[index + 1].code} onChange={({ target: { value } }) => onChange('material_details', { code: value }, index + 1)} />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return <></>
                                    })
                                }
                                {
                                    !view && <div className="col-sm-4">
                                    <MinusOutlined className="minus-wrap" 
                                     onClick={() => {
                                        if(data.md_id) {
                                            handleRemoveDetail(data.md_id, index);
                                        } else {
                                            setFormData({
                                                ...formData,
                                                material_details: [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]
                                            });
                                        }
                                        if (calculateAmount) {
                                            calculateAmount(0, 0, index + 1)
                                        }
                                    }}
                                    style={{ marginLeft: '8px' }} />
                                </div>
                                }
                            </div>
                        })
                    }
                    {
                        !view && <Form.Item>
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
                    }
                </Space>
            </div>
        </div>
    )
}

export default MaterialRepeator;