import React, { useEffect, useState } from "react";
import '../styles/style.css';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Space, InputNumber, message } from "antd";
import { updatematerialPo } from "@/apis/apis/adminApis";

const repeatorData = {
    description: '',
    start_date: '',
    end_date: '',
    amount: 0,
    project_site_id: ''
}

function RentalRepeator({ onChange, siteOptions, formData, setFormData, form, edit, view, calculateAmount }) {
    const [endDateError, setEndDateError] = useState(null);
    useEffect(() => {
        if (edit) {
            form.setFieldValue('start_date', formData.material_details[0]?.date);
            form.setFieldValue('end_date', formData.material_details[0]?.end_date);
        }
    }, [formData.material_details[0]?.date, edit, formData.material_details[0]?.end_date]);

    const handleStartDateChange = (value) => {
        onChange('material_details', { start_date: value }, 0);
        if (formData.material_details[0]?.end_date && value > formData.material_details[0]?.end_date) {
            setEndDateError('Start date cannot be greater than end date');
        } else {
            setEndDateError(null);
        }
    };

    const handleEndDateChange = (value) => {
        onChange('material_details', { end_date: value }, 0);
        if (formData.material_details[0]?.start_date && value < formData.material_details[0]?.start_date) {
            setEndDateError('End date cannot be smaller than start date');
        } else {
            setEndDateError(null);
        }
    };

    const handleRemoveDetail = async (id, index) => {
        await updatematerialPo({ md_id: id }).then((response) => {
            if (response?.data?.status) {
                message.success(response.data.message);
                formData.material_details = [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]
            }
        })
    }
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
                            className={`selectwrap ${view ? 'description-clr' : ""} columns-select shipment-caret `}
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
                            name="start_date0"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter date",
                                },
                            ]}
                        >
                            <Input readOnly={view} onChange={({ target: { value } }) => handleStartDateChange(value)} type="date"></Input>
                        </Form.Item>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div className="wrap-box">
                        <Form.Item
                            label="To"

                            name="end_date0"
                            validateStatus={endDateError ? 'error' : ''}
                            help={endDateError}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter date",
                                },
                            ]}
                        >
                            <Input readOnly={view} onChange={({ target: { value } }) => handleEndDateChange(value)} type="date"></Input>
                        </Form.Item>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div className="wrap-box no-number-rental">
 
                        <Form.Item
                            label="Amount"
                            name="amount0"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter only numbers",
                                }
                            ]}
                        >
                            <InputNumber
                                readOnly={view}
                                addonBefore="$"
                                placeholder="Amount"
                                formatter={value => {
                                    return `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')
                                }}
                                parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}
                                onChange={(value) => {
                                    if (!/^[0-9]*$/.test(value)) {
                                        message.error("Please enter only numbers");
                                        return;
                                    }
                                    form.setFieldValue('amount0', (value || 0) || '0');
                                    onChange('material_details', { amount: (value || 0) }, 0);
                                }}
                            />
                        </Form.Item> 

                        {/* <Form.Item
                            label="Amount"
                            name="amount0"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter numbers only",
                                    pattern: /^[0-9]*$/, // Regex to allow only numbers
                                    validateTrigger: 'onChange', // Trigger validation on every change
                                    validator: (_, value) => {
                                        if (!value || /^[0-9]*$/.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Please enter numbers only'));
                                    },
                                },
                            ]}
                        >
                            <InputNumber
                                readOnly={view}
                                addonBefore="$"
                                placeholder="Amount"
                                formatter={value => `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')}
                                parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}
                                onChange={(value) => {
                                    form.setFieldValue('amount0', (value || 0) || '0');
                                    onChange('material_details', { amount: (value || 0) }, 0);
                                }}
                            />
                        </Form.Item> */}


                        {/* <Form.Item
                            label="Amount"
                            name="amount0"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter only numbers",
                                    pattern: /^[0-9]*$/, // Regex to allow only numbers
                                }
                            ]}
                        >
                            <InputNumber
                                readOnly={view}
                                addonBefore="$"
                                placeholder="Amount"
                                formatter={value => `${value}`.replace(new RegExp(/\B(?=(\d{3})+(?!\d))/g), ',')}
                                parser={value => value.replace(new RegExp(/\$\s?|(,*)/g), '')}
                                onChange={(value) => {
                                    form.setFieldValue('amount0', (value || 0) || '0');
                                    onChange('material_details', { amount: (value || 0) }, 0);
                                }}
                            />
                        </Form.Item> */}


                    </div>
                </div>
                {formData.shipment_type === 'project related' && (
                    <div class="col-lg-4 col-md-6">
                        {/* <div className="selectwrap columns-select shipment-caret "> */}
                        <div className={`selectwrap ${view ? 'non-editable-dropdown' : ""} columns-select shipment-caret`}>

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
                                                <div className="col-lg-4 col-md-6">
                                                    <div key={key} className="wrap-box no-number-rental">
                                                        <Form.Item
                                                            label={upperKey}
                                                            name={'amount' + (index + 1)}
                                                            rules={[
                                                                { required: true, message: `Please enter ${upperKey}` },
                                                            ]}
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
                                                            // onChange={({ target: { value, name } }) => onChange('material_details', { [key]: value }, index + 1)}
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
                                                                className={`selectwrap ${view ? 'description-clr' : ""} columns-select shipment-caret `}
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
                                        else if (key === 'start_date' || key === 'date') {
                                            return (

                                                <div className="col-lg-4 col-md-6">
                                                    <div className="wrap-box">
                                                        <Form.Item
                                                            label={upperKey}
                                                            name={`start_date` + (index + 1)}
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
                                                                onChange={({ target: { value, name } }) => {
                                                                    handleStartDateChange(value);
                                                                    onChange('material_details', { [key]: value }, index + 1);
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if (key === 'end_date') {
                                            return (

                                                <div className="col-lg-4 col-md-6">
                                                    <div className="wrap-box">
                                                        <Form.Item
                                                            label={upperKey}
                                                            name={"end_date" + (index + 1)}
                                                            validateStatus={endDateError ? 'error' : ''}
                                                            help={endDateError}
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
                                                                onChange={({ target: { value, name } }) => {
                                                                    handleEndDateChange(value);
                                                                    onChange('material_details', { [key]: value }, index + 1);
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if (key === 'project_site_id' && formData.shipment_type === 'project related') {
                                            return (
                                                <div class="col-lg-4 col-md-6">
                                                    <div className="wrap-box">
                                                        {/* <div className="selectwrap columns-select shipment-caret"> */}
                                                        <div className={`selectwrap ${view ? 'non-editable-dropdown' : ""} columns-select shipment-caret`}>

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
                                        }
                                        return
                                    })
                                }
                                <div className="col-sm-4">
                                    <MinusOutlined className="minus-wrap" onClick={async () => {
                                        if (data.md_id) {
                                            await handleRemoveDetail(data.md_id, index);
                                        } else {
                                            formData.material_details = [...formData.material_details.slice(0, index + 1), ...formData.material_details.slice(index + 1 + 1)]

                                        }
                                        if (calculateAmount) {
                                            calculateAmount();
                                        }
                                    }} style={{ marginLeft: '8px' }} />
                                </div>
                            </div>
                        })
                    }
                    {
                        !view && <Form.Item className="mt-3">
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

export default RentalRepeator;