import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { changeStatus, fetchPo, updatePo } from "@/apis/apis/adminApis";
import { Form, Select, Button, Input,message } from "antd";
import PoForm from "@/components/Form";
import ChangeStatus from "@/components/PoChangeStatus";
import dayjs from "dayjs";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";

const { Option } = Select;

const EditSubContractorPo = () => {
    const [formData, setFormData] = useState({
        po_number: '',
        po_type: '',
        po_date:'',
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
        vendor_name: '',
        material_details: []
    });

    const [isModalOpen, setIsModalOpen] = useState({
        modalStatus: false,
        action: ''
    });
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
                        // po_date:data.po_date,
                        can_change_status: res.data?.can_change_status,
                        amount: data.total_amount,
                        subcontractor_type: data.subcontractor_type,
                        invoice_amount: data.invoice_received_amount,
                        original_po_amount: data.total_amount,
                        company_name: data.vendor_contact.company.company_name,
                        vendor_id: data.vendor_contact.company.vendor_id,
                        vendor_name: data.vendor_contact?.name,
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
                        material_details: data.material_details.map((detail) => {
                            return {description:detail.description,date:detail.date,amount:detail.amount,md_id:detail.md_id, project_site_id: detail?.project_site }
                        }),
                        status: data.status
                    });
                    form.setFieldValue('po_type', data.po_type);
                    form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                    form.setFieldValue('vendor_id', data.vendor_contact?.company?.is_deleted ? data.vendor_contact?.company.company_name : data.vendor_contact?.company.vendor_id);
                    form.setFieldValue('vendor_name', data.vendor_contact?.name);
                    form.setFieldValue('vendor_contact_id', data.vendor_contact.vendor_contact_id);
                    form.setFieldValue('hst_amount', (data.hst_amount).toLocaleString()) || 0;
                    form.setFieldValue('total_amount', data.total_amount.toLocaleString());
                    form.setFieldValue('original_po_amount', data.total_amount.toLocaleString());
                    form.setFieldValue('project_id', typeof data.project === 'object' ? data.project?.is_deleted ? data.project.name : data.project?.project_id : data.project);
                    form.setFieldValue('poDate', dayjs(data.po_date));
                    // form.setFieldValue('poDate', data.po_date);
                    form.setFieldValue('country', data.vendor_contact.company.country);
                    form.setFieldValue('state', data.vendor_contact.company.state);
                    form.setFieldValue('address', data.vendor_contact.company.address);
                    form.setFieldValue('phone', data.vendor_contact.phone_number.slice(2));
                    form.setFieldValue('email', data.vendor_contact.email);
                    form.setFieldValue('poNumber', data.po_number)
                    form.setFieldValue('shipment_type', data.shipment_type || 'project related')
                    form.setFieldValue('description', data.material_details[0]?.description)
                    form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                    form.setFieldValue('first_name', data.created_by.first_name)
                    form.setFieldValue('last_name', data.created_by.last_name);
                    form.setFieldValue('subcontractor_type', data.subcontractor_type);
                    form.setFieldValue('invoice_amount', data.invoice_received_amount);
                    data?.material_details.forEach((material, index) => {
                        form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                        form.setFieldValue('material_for' + (index), material.material_for)
                        form.setFieldValue('project_id' + (index), material.project === 'object' ? material.project?.is_deleted ? material.project.name : material.project?.project_id : material.project)
                        // form.setFieldValue('project_id' + (index), material.project?.project_id)
                        form.setFieldValue('amount' + (index), material.amount.toLocaleString())
                        // form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
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
    const handleRepeaterAmountChange = () => {

        const totalAmount = getTotalAmount()

        formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
        formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
        setFormData({
            ...formData,
            // hst_amount: totalAmount * 0.13,
            // total_amount: totalAmount * 0.13 + totalAmount
        })
        if(totalAmount > 0) {
                    form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toLocaleString() || 0 });
                    form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toLocaleString() || 0 });
                }
        // form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toLocaleString() || 0 });
        // form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toLocaleString() || 0 });
    };

    // const calculateAmount = (amount, index) => {
    //     const totalAmount = getTotalAmount();
    //     formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
    //     formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
    //     if(totalAmount > 0) {
    //         form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toLocaleString() || 0 });
    //         form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toLocaleString() || 0 });
    //     }
    //     setFormData({
    //         ...formData
    //     })
    // }

    const onFinish = () => {
        updatePo({
            ...formData,
            po_id: id,
            material_details: formData.material_details.map((detail) => {
                return {
                    ...detail,
                    project_site_id: detail.project_site_id.site_id
                }
            }),
            original_po_amount : formData.subcontractor_type === 'new' ? undefined : formData.original_po_amount
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
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if(value.amount) {
                handleRepeaterAmountChange();
                // calculateAmount();
            }
            formData.material_details[index] = {
                ...materalDetails
            };
            
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
            co_approved_amount: data?.co_approved_amount
        });
        response.then((res) => {
            if(res?.data?.status) {
                message.success(res.data?.message);
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
                        <li class="icon-text react-icon justify-content-between">
                        <div className="plus-wraptext d-flex align-items-center">
                                <PlusOutlined />
                                <span>Edit Purchase Order</span>
                            </div>
                            {
                                formData.status === 'pending' && formData.can_change_status && <Roles action="approve_purchase_order">
                                <div className="mt-0 apr-rej-li d-flex">
                                    <Button type="primary" className="approved-btn me-3" onClick={(event) => {
                                        setIsModalOpen({
                                            modalStatus: true,
                                            action: 'approved'
                                        })
                                    }}>Approve</Button>
                                    <Button type="primary" danger className="reject-btn" onClick={(event) => {
                                        setIsModalOpen({
                                            modalStatus: true,
                                            action: 'rejected'
                                        })
                                    }}>Reject</Button>
                                </div>
                            </Roles>
                            }
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
                                    <PoForm formData={formData} edit={true} isNew={true} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} calculateAmount
                                    =
                                    {handleRepeaterAmountChange}
                                    // {calculateAmount} 
                                    />
                                    
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
            {isModalOpen && <ChangeStatus po_id={id} poType={"subcontractor"} handleStatusChange={handleStatusChange} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </>
    );
};

export { getServerSideProps };
export default withAuth(['admin', 'project coordinator','project manager','site superintendent','marketing','health $ safety','estimator','shop'])(EditSubContractorPo)
