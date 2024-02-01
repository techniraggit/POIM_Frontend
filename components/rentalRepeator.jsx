import React, { useEffect } from "react";
import '../styles/style.css';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Space } from "antd";

const repeatorData = {
    description: '',
    start_date: '',
    end_date:'',
    amount: 0,
    project_site_id: ''
}

function RentalRepeator({ onChange, siteOptions, formData, setFormData, form, edit, view }) {
  useEffect(() => {
    if(edit) {
        form.setFieldValue('start_date', formData.material_details[0]?.start_date);
        form.setFieldValue('end_date', formData.material_details[0]?.end_date);
    }
  }, [formData.material_details[0]?.start_date, edit,formData.material_details[0]?.end_date]);

  return (
    <div class="row">
        <div class="col-12 space-col-spc mb-3">
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
                    <Input.TextArea 
                    readOnly={view} rows={4} cols={50} 
                    placeholder="description" 
                    onChange={(e) => onChange('material_details',
                     { description: e.target.value }, 0)} />
                </Form.Item>
            </div>
        </div>
        <div class="row space-col-spc mb-0">
            <div class="col-sm-4">
                <div className="wrap-box">
                    <Form.Item
                        label="Date"
                        name="start_date"
                        rules={[
                            {
                                required: true,
                                message: "Please enter date",
                            },
                        ]}
                    >
                        <Input readOnly={view} onChange={({ target: { value } }) => onChange('material_details', { start_date: value }, 0)} type="date"></Input>
                    </Form.Item>
                </div>
            </div>
            <div class="col-sm-4">
                <div className="wrap-box">
                    <Form.Item
                        label="To"
                        name="end_date"
                        rules={[
                            {
                                required: true,
                                message: "Please enter date",
                            },
                        ]}
                    >
                        <Input readOnly={view} onChange={({ target: { value } }) => onChange('material_details', { end_date: value }, 0)} type="date"></Input>
                    </Form.Item>
                </div>
            </div>
            <div class="col-sm-4">
                <div className="wrap-box dollor-inputs">
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
                        <Input 
                        readOnly={view}
                        addonBefore="$"
                        placeholder="Amount" onChange={({ target: { value } }) => onChange('material_details', { amount: value }, 0)} />
                    </Form.Item>
                </div>
            </div>
            {formData.shipment_type === 'project related' && (
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
                        return <div className="row align-items-center mt-4">
                            
                            {
                                Object.keys(data).map((key) => {
                                    let upperKey = key.charAt(0).toUpperCase() + key.slice(1);
                                    if (key.includes('_')) {
                                        upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                    }
                                    if (key === "amount") {
                                        return (
                                            <div className="col-sm-4">
                                            <div key={key} className="wrap-box dollor-inputs">
                                                <Form.Item
                                                    label={upperKey}
                                                    rules={[{ required: true, message: `Please enter ${upperKey}` }]}
                                                >
                                                    <Input
                                                    readOnly={view}
                                                    addonBefore="$"
                                                        placeholder={upperKey}
                                                        value={data[key]}
                                                        name={key + index}
                                                        onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                    />
                                                </Form.Item>
                                            </div>
                                            </div>
                                        )
                                    } else if (key === 'description') {
                                        return (
                                            <div clclassName="col-sm-12">
                                            <div key={key} className="wrap-box">
                                                <Form.Item
                                                    label={"Description"}
                                                    rules={[{ required: true, message: `Please enter description` }]}
                                                >
                                                    <Input.TextArea
                                                        readOnly={view}
                                                        rows={4}
                                                        cols={50}
                                                        placeholder={"description"}
                                                        value={data[key]}
                                                        name={key + index}
                                                        onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                    />
                                                </Form.Item>
                                            </div>
                                            </div>
                                        )
                                    }
                                     else if (key === 'start_date') {
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
                                                        <Input type="date" readOnly={view}
                                                            placeholder={upperKey}
                                                            value={data[key]}
                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                        ></Input>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        )
                                    } 
                                    else if (key === 'end_date') {
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
                                                        <Input type="date" readOnly={view}
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
                                        )
                                    }
                                    return 
                                })
                            }
                            <div className="col-sm-4">
                            <MinusOutlined className="minus-wrap" onClick={() => {
                                setFormData({
                                    ...formData,
                                    material_details: [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]
                                });
                            }} style={{ marginLeft: '8px' }} />
                            </div>
                        </div>
                    })
                }
                <Form.Item className="mt-3">
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

export default RentalRepeator;