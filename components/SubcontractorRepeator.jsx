import React, { useEffect } from "react";
import '../styles/style.css';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Space, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

const repeatorData = {
    description: '',
    date: '',
    amount: 0,
    project_site_id: ''
}

function SubcontractorRepeator({ onChange, siteOptions, formData, setFormData, form, edit, view, calculateAmount }) {
    useEffect(() => {
        if (edit) {
            form.setFieldValue('date', formData.material_details[0]?.date);
        }
    }, [formData.material_details[0]?.date, edit]);

    return (
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
                        <Input.TextArea disabled={view} rows={4} cols={50} placeholder="Scope Of Work" onChange={(e) => onChange('material_details', { description: e.target.value }, 0)} />
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
                            <Input readOnly={view} onChange={({ target: { value } }) => onChange('material_details', { date: dayjs(value).format('YYYY-MM-DD') }, 0)} type="date"></Input>
                        </Form.Item>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div className="wrap-box  no-number-rental">                        
                        <Form.Item
                            label="Amount"
                            for="name"
                            name="amount0"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Amount",
                                },
                            ]}
                        >
                            <InputNumber
                                placeholder="Amount" 
                                readOnly={view}
                                addonBefore="$"
                                formatter={value => `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')}
                                parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}
                                onChange={(value) => {
                                    form.setFieldValue('amount0', (value || 0) || '0')
                                    onChange('material_details', { amount: (value || 0) }, 0)
                                }}
                            />
                        </Form.Item>
                    </div>
                </div>
                {formData.shipment_type === 'project related' && (
                    <div class="col-sm-4">
                        {/* <div className="selectwrap columns-select shipment-caret "> */}
                        <div class={`selectwrap ${view || edit && formData.status !== 'pending' ? 'non-editable-dropdown' : ''} shipment-caret columns-select`}>

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
                            return <div className="row">

                                {
                                    Object.keys(data).map((key) => {
                                        let upperKey = key.charAt(0).toUpperCase() + key.slice(1);
                                        if (key.includes('_')) {
                                            upperKey = key.split('_').map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' ').replace('Id', '');
                                        }
                                        if (key === "amount") {
                                            return (
                                                <div className="col-sm-4">
                                                    <div key={key} className="wrap-box create-an-more no-number-rental">
                                                        <Form.Item
                                                            label={upperKey}
                                                            name={'amount' + (index + 1)}
                                                            rules={[{ required: true, message: `Please enter ${upperKey}` }]}
                                                        >
                                                            <InputNumber
                                                                readOnly={view}
                                                                addonBefore="$"
                                                                placeholder={upperKey}
                                                                value={data[key]}
                                                                name={key + index}
                                                                formatter={value => `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')}
                                                                parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}

                                                                onChange={(value) => {
                                                                    form.setFieldValue('amount' + (index + 1), (value || 0) || '0')
                                                                    onChange('material_details', { [key]: (value || 0) }, index + 1)
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </div>
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
                                                            readOnly={view}
                                                            cols={50}
                                                            placeholder={"Enter Scope Of Work"}
                                                            value={data[key]}
                                                            name={key + index}
                                                            onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            )
                                        }
                                        else if (key === 'date') {
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
                                                                readOnly={view}
                                                                placeholder={upperKey}
                                                                value={data[key]}
                                                                onChange={({ target: { value, name } }) => onChange('material_details', { [key]: dayjs(value).format('YYYY-MM-DD') }, index + 1)}
                                                            // onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
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
                                        return <></>
                                    })
                                }
                                {
                                    !view && <MinusOutlined className="minus-wrap" onClick={() => {
                                        setFormData({
                                            ...formData,
                                            material_details: [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]
                                        });
                                        if (calculateAmount) {
                                            calculateAmount(0, index + 1);
                                        }
                                    }} style={{ marginLeft: '8px' }} />
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
                                        project_site_id: formData.material_details[0]?.project_site_id
                                    }]
                                });
                            }} icon={<PlusOutlined />}>
                                Add More Items
                            </Button>
                        </Form.Item>
                    }
                </Space>
            </div>
        </div>
    )
}

export default SubcontractorRepeator;