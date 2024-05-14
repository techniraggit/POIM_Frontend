import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import { PlusOutlined } from '@ant-design/icons';
import { changeStatus, fetchPo, updatePo } from "@/apis/apis/adminApis";
import { Form, Select, Button, message } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import Roles from "@/components/Roles";
import ChangeStatus from "@/components/PoChangeStatus";
import PoForm from "@/components/Form";
import withAuth from "@/components/PrivateRoute";
import { roundToTwoDigits } from "@/utility/utilityFunctions";

const { Option } = Select;

const Edit_Rental_Po = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState({
        modalStatus: false,
        action: ''
    });
    const [refetch, setRefetch] = useState(true);
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
        vendor_name: '',
        material_details: []
    });

    useEffect(() => {
        if(refetch) {
            form.setFieldValue('po_type', 'rental');
            fetchPo(id).then((res) => {
                if (res?.data?.status) {
                    const data = res.data.data;
                    setFormData({
                        ...formData,
                        can_change_status: res.data?.can_change_status,
                        po_type: data.po_type,
                        amount: data.amount,
                        company_name: data.vendor_contact?.company.company_name,
                        vendor_id: data.vendor_contact?.company.vendor_id,
                        project_id: data.vendor_contact?.company.project_id,
                        vendor_contact_id: data.vendor_contact?.vendor_contact_id,
                        hst_amount: data.hst_amount,
                        vendor_name: data.vendor_contact?.name,
                        total_amount: data.total_amount,
                        country: data.vendor_contact?.company.country,
                        state: data.vendor_contact?.company.state,
                        address: data.vendor_contact?.company.address,
                        phone: data.vendor_contact?.phone_number,
                        email: data.vendor_contact?.email,
                        shipment_type: data.shipment_type,
                        project_id: typeof data.project === 'object' ? data.project?.project_id : data.project,
                        material_details: data.material_details.map((details) => {
                            return {description:details.description, start_date: details.date,end_date:details.end_date,
                                amount:details.amount,
                                 project_site_id: details.project_site ,md_id:details.md_id}
                            // return {...details, project_site_id: details.project_site?.site_id, start_date: details.date}
                        }),
                        status: data.status
                    });
                    form.setFieldValue('po_type', data.po_type);
                    form.setFieldValue('company_name', data.vendor_contact?.company.company_name)
                    form.setFieldValue('vendor_id', data.vendor_contact?.company?.is_deleted ? data.vendor_contact?.company.company_name : data.vendor_contact?.company.vendor_id);
                    form.setFieldValue('vendor_name', data.vendor_contact?.name);
                    form.setFieldValue('vendor_contact_id', data.vendor_contact?.vendor_contact_id);
                    form.setFieldValue('shipment_type', data.shipment_type);
                    form.setFieldValue('project_id', typeof data.project === 'object' ? data.project?.is_deleted ? data.project.name : data.project?.project_id : data.project);
                    form.setFieldValue('hst_amount', data.hst_amount.toLocaleString()) || 0;
                    form.setFieldValue('total_amount', data.total_amount.toLocaleString());
                    form.setFieldValue('poDate', moment(data.po_date));
                    form.setFieldValue('country', data.vendor_contact?.company.country);
                    form.setFieldValue('state', data.vendor_contact?.company.state);
                    form.setFieldValue('address', data.vendor_contact?.company.address);
                    form.setFieldValue('phone', data.vendor_contact?.phone_number.slice(2));
                    form.setFieldValue('email', data.vendor_contact?.email);
                    form.setFieldValue('poNumber', data.po_number)
                    form.setFieldValue('shipment_type', data.shipment_type)
                    form.setFieldValue('start_date0', data.material_details[0]?.date)
                    form.setFieldValue('end_date0', data.material_details[0]?.end_date)
                    form.setFieldValue('description', data.material_details[0]?.description)
                    form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                    form.setFieldValue('first_name', data.created_by.first_name)
                    form.setFieldValue('last_name', data.created_by.last_name)
                    data?.material_details.forEach((material, index) => {
                        form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                        form.setFieldValue('material_for' + (index), material.material_for)
                        form.setFieldValue('project_id' + (index), material.project === 'object' ? material.project?.is_deleted ? material.project.name : material.project?.project_id : material.project)
                        // form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                        if(index > 0) {
                            form.setFieldValue('start_date' + (index), material?.date)
                            form.setFieldValue('end_date' + (index), material?.end_date)
                        }
                        form.setFieldValue('amount' + (index), material.amount.toLocaleString())
                    })
                }
            });
            setRefetch(false);
        }
    }, [refetch]);

    const onFinish = () => {
        updatePo({
            ...formData,
            po_id: id,
            material_details: formData.material_details.map((detail) => {
                return {
                    ...detail,
                    project_site_id: detail.project_site_id.site_id || detail.project_site_id
                }
            })
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        })
        .catch((error)=>{
            message.error(error.response.data.message)
        })
    }

    const onChange = (name, value, index) => {
        if (name === 'material_details') {
            const materialDetails = formData.material_details;
            Object.keys(value).map((key) => {
                materialDetails[index][key] = value[key];
            });

            formData.material_details = [...materialDetails]
        } else {
            formData[name] = value;
        }
        if (value.amount || name === 'amount') {
            handleRepeaterAmountChange();
        }
        setFormData({
            ...formData
        })
    }

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return roundToTwoDigits(total + parseFloat(item.amount));
        }, 0);

        return totalAmount;
    };

    const handleRepeaterAmountChange = () => {
        const totalAmount = getTotalAmount()
        formData.hst_amount = roundToTwoDigits(totalAmount * 0.13);
        formData.total_amount = roundToTwoDigits(totalAmount * 0.13 + totalAmount);
        form.setFieldsValue({ 'hst_amount': roundToTwoDigits((totalAmount * 0.13) || 0).toLocaleString() });
        form.setFieldsValue({ 'total_amount': roundToTwoDigits((totalAmount * 0.13 + totalAmount) || 0).toLocaleString() });
    };

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
        }).catch((error) => {
            message.error(error.response.data.message)
            setIsModalOpen(false);
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
                                    </div>
                                    
                                    <PoForm formData={formData} edit={true} isNew={true} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} calculateAmount={handleRepeaterAmountChange} />
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
                </div >
            </div >
            {isModalOpen && <ChangeStatus po_id={id} handleStatusChange={handleStatusChange} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </>
    )
}

export { getServerSideProps };
export default withAuth(['admin', 'project coordinator','project manager','site superintendent','marketing','health $ safety','estimator','shop'])(Edit_Rental_Po)

// export default Edit_Rental_Po;