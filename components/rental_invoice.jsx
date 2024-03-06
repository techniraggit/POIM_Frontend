import React, { useEffect, useState } from "react";
import {  updatePo} from "@/apis/apis/adminApis";
import { Form, Select } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import PoForm from "@/components/Form";

const { Option } = Select;

const Rental_invoice = ({ data }) => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { id } = router.query;
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
        material_details: []
    });
    useEffect(() => {
        if (data) {
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
            form.setFieldValue('hst_amount', (data.hst_amount).toLocaleString()) || 0;
            form.setFieldValue('total_amount', data.total_amount.toLocaleString());
            form.setFieldValue('project_id', typeof data.project === 'object' ? data.project?.project_id : data.project);
            form.setFieldValue('poDate', moment(data.po_date));
            form.setFieldValue('country', data.vendor_contact.company.country);
            form.setFieldValue('state', data.vendor_contact.company.state);
            form.setFieldValue('address', data.vendor_contact.company.address);
            form.setFieldValue('phone', data.vendor_contact.phone_number);
            form.setFieldValue('email', data.vendor_contact.email);
            form.setFieldValue('poNumber', data.po_number)
            form.setFieldValue('amount', data.material_details[0]?.amount)
            form.setFieldValue('description', data.material_details[0]?.description)
            form.setFieldValue('start_date', data.material_details[0]?.date)
            form.setFieldValue('end_date', data.material_details[0]?.end_date)
            form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
            form.setFieldValue('first_name', data.created_by.first_name)
            form.setFieldValue('last_name', data.created_by.last_name)
            data?.material_details.forEach((material, index) => {
                form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                form.setFieldValue('material_for' + (index), material.material_for)
                form.setFieldValue('project_id' + (index), material.project?.project_id)
                form.setFieldValue('amount' + (index), material.amount.toLocaleString())
            })
        }
    }, []);
    const onFinish = () => {
        updatePo({
            ...formData,
            po_id: id
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
        if (value.amount || name === 'amount') {
            handleRepeaterAmountChange();
        }
    }

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const handleRepeaterAmountChange = () => {
        const totalAmount = getTotalAmount()
        setFormData({
            ...formData,
            hst_amount: totalAmount * 0.13,
            total_amount: totalAmount * 0.13 + totalAmount
        })
        form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) || 0 });
        form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
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
                        <PoForm formData={formData} view={true} edit={true} isNew={true} form={form} onChange={onChange} onFinish={onFinish} setFormData={() => {}} />
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Rental_invoice;