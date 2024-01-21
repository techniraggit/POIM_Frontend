import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { createPO, fetchPo, getPoNumber } from "@/apis/apis/adminApis";
import { Form, Select, Button } from "antd";
import PoForm from '../../components/Form';
import moment from "moment";

const { Option } = Select;

const repeatorData = {
    quantity:'',
    unit_price:'',
    description: '',
    code:'',
    amount: 0,
    project_site_id: '',
    material_for:''
}

const EditMaterialPo = () => {
    const [formData, setFormData] = useState({
        po_number: '',
        po_type: 'material',
        amount: 0,
        company_name: '',
        vendor_id: '',
        project_id: '',
        vendor_contact_id: '',
        shipment_type: '',
        hst_amount: '',
        total_amount: '',
        country: '',
        state: '',
        address: '',
        phone: '',
        email: '',
        material_details: [{ ...repeatorData }]
    });

    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;

    useEffect(() => {
        fetchPo(id).then((res) => {
            if (res?.data?.status) {
                const data = res.data.data;
                setFormData({
                    ...formData,
                    po_type: data.po_type,
                    amount: data.total_amount,
                    company_name: data.vendor_contact?.company.company_name,
                    vendor_id: data.vendor_contact?.company.vendor_id,
                    vendor_contact_id: data.vendor_contact?.vendor_contact_id,
                    hst_amount: data.hst_amount,
                    total_amount: data.total_amount,
                    project_site_id: data.project_site,
                    country: data.vendor_contact?.company.country,
                    state: data.vendor_contact?.company.state,
                    address: data.vendor_contact?.company.address,
                    phone: data.vendor_contact?.phone_number,
                    email: data.vendor_contact?.email,
                    shipment_type: data.shipment_type,
                    delivery_address: data.delivery_address || '1860 Shawson',
                    material_details: [...data.material_details]
                });
                form.setFieldValue('po_type', data.po_type);
                form.setFieldValue('company_name', data.vendor_contact?.company.company_name)
                form.setFieldValue('vendor_id', data.vendor_contact?.company.vendor_id);
                form.setFieldValue('vendor_contact_id', data.vendor_contact?.vendor_contact_id);
                form.setFieldValue('shipment_type', data.shipment_type);
                form.setFieldValue('hst_amount', (data.hst_amount).toFixed(2)) || 0;
                form.setFieldValue('total_amount', data.total_amount);
                form.setFieldValue('project_id', data.project_site?.project?.project_id);
                form.setFieldValue('project_site_id', data.project_site?.site_id);
                form.setFieldValue('poDate', moment(data.po_date));
                form.setFieldValue('country', data.vendor_contact?.company.country);
                form.setFieldValue('state', data.vendor_contact?.company.state);
                form.setFieldValue('address', data.vendor_contact?.company.address);
                form.setFieldValue('phone', data.vendor_contact?.phone_number);
                form.setFieldValue('email', data.vendor_contact?.email);
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
        });
    }, []);

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const onFinish = () => {
        createPO({
            ...formData,
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        });
    }

    const onChange = (name, value, index) => {
        if (name === 'material_details') {
            let totalAmount = 0;
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if (value.amount) {
                totalAmount = getTotalAmount();
            }
            formData.material_details[index] = {
                ...materalDetails
            };
            formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
            formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
            if (totalAmount > 0) {
                form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) || 0 });
                form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
            }
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
    }

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Purchase Orders' />
                    <div className="bottom-wrapp">

                        <ul class=" create-icons">
                            <li class="icon-text react-icon">
                                <PlusOutlined />
                                <span>Edit Purchase Order</span>
                            </li>
                        </ul>
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

                                    <PoForm formData={formData} isNew={false} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} />
                                    
                                    <div className="po-wrap create-wrap-butt m-0">
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="create-ven-butt">
                                                Update PO
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { getServerSideProps };
export default EditMaterialPo;