import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { changeStatus, fetchPo, updatePo } from "@/apis/apis/adminApis";
import { Form, Select, Button, Input } from "antd";
import moment from "moment";
import PoForm from "@/components/Form";
import ChangeStatus from "@/components/PoChangeStatus";

const { Option } = Select;

const EditSubContractorPo = () => {
    const [formData, setFormData] = useState({
        po_number: '',
        po_type: '',
        amount: 0,
        company_name: '',
        vendor_id: '',
        vendor_contact_id: '',
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refetch, setRefetch] = useState(true);

    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;

    useEffect(() => {
        if(refetch) {

            form.setFieldValue('po_type', 'subcontractor');
            fetchPo(id).then((res) => {
                if(res?.data?.status) {
                    const data = res.data.data;
                    setFormData({
                        ...formData,
                        po_type: data.po_type,
                        can_change_status: res.data?.can_change_status,
                        amount: data.total_amount,
                        subcontractor_type: data.subcontractor_type,
                        invoice_amount: data.invoice_received_amount,
                        original_po_amount: data.total_amount,
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
                        project_id: typeof data.project === 'object' ? data.project?.project_id : data.project,
                        shipment_type: data.shipment_type || 'project related',
                        // material_details: [...data.material_details]
                        material_details: data.material_details.map((detail) => {
                            return { ...detail, project_site_id: detail.project_site.site_id }
                        }),
                        status: data.status
                    });
                    form.setFieldValue('po_type', data.po_type);
                    form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                    form.setFieldValue('vendor_id', data.vendor_contact.company.vendor_id);
                    form.setFieldValue('vendor_contact_id', data.vendor_contact.vendor_contact_id);
                    form.setFieldValue('hst_amount', (data.hst_amount).toFixed(2)) || 0;
                    form.setFieldValue('total_amount', data.total_amount);
                    form.setFieldValue('original_po_amount', data.total_amount);
                    form.setFieldValue('project_id', typeof data.project === 'object' ? data.project?.project_id : data.project);
                    form.setFieldValue('poDate', moment(data.po_date));
                    form.setFieldValue('country', data.vendor_contact.company.country);
                    form.setFieldValue('state', data.vendor_contact.company.state);
                    form.setFieldValue('address', data.vendor_contact.company.address);
                    form.setFieldValue('phone', data.vendor_contact.phone_number);
                    form.setFieldValue('email', data.vendor_contact.email);
                    form.setFieldValue('poNumber', data.po_number)
                    form.setFieldValue('shipment_type', data.shipment_type || 'project related')
                    form.setFieldValue('amount', data.material_details[0]?.amount)
                    form.setFieldValue('description', data.material_details[0]?.description)
                    form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                    form.setFieldValue('first_name', data.created_by.first_name)
                    form.setFieldValue('last_name', data.created_by.last_name);
                    form.setFieldValue('subcontractor_type', data.subcontractor_type);
                    form.setFieldValue('invoice_amount', data.invoice_received_amount);
                    data?.material_details.forEach((material, index) => {
                        form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                        form.setFieldValue('material_for' + (index), material.material_for)
                        form.setFieldValue('project_id' + (index), material.project?.project_id)
                        form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                    })
                }
            });
            setRefetch(false);
        }
    }, [refetch]);

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const onFinish = () => {
        updatePo({
            ...formData,
            po_id: id
        }).then((res) => {
            if(res?.data?.status) {
                router.push('/po_list');
            }
        })
        .catch((error)=>{
            message.error(error.response.data.message)
        })
    }
    
    const onChange = (name, value, index) => {
        if(name === 'material_details') {
            let totalAmount = 0;
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if(value.amount) {
                totalAmount = getTotalAmount();
            }
            formData.material_details[index] = {
                ...materalDetails
            };
            formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
            formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
            if(totalAmount > 0) {
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

    const handleStatusChange = (event, action, data) => {
        event.preventDefault()
        const response = changeStatus({
            po_id: id,
            status: action,
            approval_notes: data?.approval_notes,
            approve_amount: data?.approve_amount
        });
        response.then((res) => {
            if(res?.data?.status) {
                setIsModalOpen(false);
                setRefetch(true);
            }
        })
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
                                <span>Create Purchase Order</span>
                            </li>
                            {
                                formData.status === 'pending' && formData.can_change_status && <Roles action="approve_purchase_order">
                                <li>
                                    <Button type="primary" onClick={() => {
                                        setIsModalOpen(true);
                                    }}>Approve</Button>
                                    <Button type="primary" danger onClick={(event) => {
                                        handleStatusChange(event, 'rejected')
                                    }}>Reject</Button>
                                </li>
                            </Roles>
                            }
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
                                        <div className="col-lg-4 col-md-6">
                                            <div className="selectwrap react-select">
                                                <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                                    <Form.Item
                                                        label="Choose Subcontractor Type"
                                                        name="subcontractor_type"
                                                        class="bold-label"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please choose subcontractor Type",
                                                            },
                                                        ]}
                                                    >
                                                        <Select disabled onChange={(value) => onChange('subcontractor_type', value)} placeholder="Select PO Type" id="single1"
                                                            class="js-states form-control file-wrap-select bold-select"
                                                        >
                                                            <Option value="existing">Existing</Option>
                                                            <Option value="new">New</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(formData.subcontractor_type === 'existing') && (
                                        <>
                                            <div className="row mt-5 mb-3">
                                                <div class="col-lg-4 col-md-6">
                                                    <div class="wrap-box">
                                                        <Form.Item
                                                            label="Original PO Amount"
                                                            name="original_po_amount"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter Original PO Amount",
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                             addonBefore="$"
                                                            onChange={({ target: { value } }) => onChange('original_po_amount', value)} placeholder="Original PO Amount" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 col-md-6">
                                                    <div class="wrap-box">
                                                        <Form.Item
                                                            label="Invoice Recieved Amount"
                                                            name="invoice_amount"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: "Please enter Invoice Recieved Amount",
                                                                },
                                                            ]}
                                                        >
                                                            <Input 
                                                             addonBefore="$"
                                                            onChange={({ target: { value } }) => onChange('invoice_amount', value)} placeholder="Invoice Recieved Amount" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    }
                                    <PoForm formData={formData} edit={true} isNew={true} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} />
                                    
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
            {isModalOpen && <ChangeStatus po_id={id} handleStatusChange={handleStatusChange} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </>
    );
};

export { getServerSideProps };

export default EditSubContractorPo;