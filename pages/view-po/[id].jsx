import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { updatePO, fetchPo, changeStatus } from "@/apis/apis/adminApis";
import { Form, Select,Button,message } from "antd";
import PoForm from '../../components/Form';
import moment from "moment";
import PoStatus from "@/components/PoStatus";
import Amendments from "@/components/Amendments";
import ChangeStatus from "@/components/PoChangeStatus";
import Roles from "@/components/Roles";

const { Option } = Select;

const repeatorData = {
    quantity: '',
    unit_price: '',
    description: '',
    code: '',
    amount: 0,
    project_site_id: '',
    material_for: ''
}

const ViewMaterialPo = () => {
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
        vendor_name: '',
        material_details: [{ ...repeatorData }]
    });
    const [isModalOpen, setIsModalOpen] = useState({
        modalStatus: false,
        action: ''
    });
    const [isStatusModalOpen,setStatusModalOpen]=useState(false);
    const [history, setHistory] = useState([])
    const [refetch, setRefetch] = useState(true);

    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;

    useEffect(() => {
        if (refetch) {
        fetchPo(id).then((res) => {
            if (res?.data?.status) {
                const data = res.data?.data;
                setFormData({
                    ...formData,
                    can_change_status: res.data?.can_change_status,
                    po_type: data.po_type,
                    amount: data.total_amount,
                    // vendor_id: data.is_deleted ? data.vendor_contact?.company.vendor_id:data.vendor_contact?.company.company_name,
                    company_name: data.vendor_contact?.company.company_name,
                    vendor_id: data.vendor_contact?.company.vendor_id,
                    vendor_name: data.vendor_contact?.name,
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
                    project_id: typeof data.project === 'object' ? data.project?.project_id : data.project,
                    delivery_address: data.delivery_address || '1860 Shawson',
                    material_details: data.material_details.map((detail) => {
                        return { ...detail, project_site_id: detail.project_site?.site_id }
                    }),
                    status: data.status,
                    notes: data?.co_approved_amount
                });
                setHistory([...res.data.history_logs_data])
                form.setFieldValue('po_type', data.po_type);
                form.setFieldValue('company_name', data.vendor_contact?.company.company_name)
                form.setFieldValue('vendor_name', data.vendor_contact?.name);
                form.setFieldValue('vendor_id', data.vendor_contact?.company?.is_deleted ? data.vendor_contact?.company.company_name : data.vendor_contact?.company.vendor_id);
                form.setFieldValue('vendor_contact_id', data.vendor_contact?.vendor_contact_id);
                form.setFieldValue('hst_amount', (data.hst_amount).toLocaleString()) || 0;
                form.setFieldValue('total_amount', data.total_amount.toLocaleString());
                form.setFieldValue('project_id', typeof data.project === 'object' ? data.project?.is_deleted ? data.project.name : data.project?.project_id : data.project);
                form.setFieldValue('poDate', moment(data.po_date));
                form.setFieldValue('country', data.vendor_contact?.company.country);
                form.setFieldValue('state', data.vendor_contact?.company.state);
                form.setFieldValue('address', data.vendor_contact?.company.address);
                form.setFieldValue('phone', data.vendor_contact?.phone_number.slice(2));
                form.setFieldValue('email', data.vendor_contact?.email);
                form.setFieldValue('poNumber', data.po_number)
                form.setFieldValue('shipment_type', data.shipment_type)
                form.setFieldValue('delivery_address', data.delivery_address || '1860 Shawson')
                form.setFieldValue('quantity', data.material_details[0]?.quantity)
                form.setFieldValue('unit_price', data.material_details[0]?.unit_price)
                form.setFieldValue('description', data.material_details[0]?.description)
                form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                // form.setFieldValue('code', data.material_details[0]?.code)
                form.setFieldValue('material_delivery', data.material_details[0]?.delivery_address || '1860 Shawson')
                form.setFieldValue('first_name', data.created_by.first_name)
                form.setFieldValue('last_name', data.created_by.last_name)
                data?.material_details.forEach((material, index) => {
                    form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                    // form.setFieldValue('project_id' + (index), material.project?.project_id)
                    form.setFieldValue('material_for' + (index), material.material_for)
                    form.setFieldValue('amount' + (index), material.amount.toLocaleString())
                    form.setFieldValue('code_' + index, material.code)
                    form.setFieldValue('quantity'+ index, material.quantity)
                    form.setFieldValue('unit_price'+ index, material.unit_price)
                })
            }
        });
        setRefetch(false)
    }
    }, [refetch]);

    const getTotalAmount = () => {
        const totalAmount = formData.material_details.reduce((total, item) => {
            return total + parseFloat(item.amount);
        }, 0);

        return totalAmount;
    };

    const calculateAmount = (quantity, unit_price, index) => {
        const amount = parseFloat(quantity) * parseFloat(unit_price);
        const materialDetails = formData.material_details[index];
        materialDetails.amount = amount;
        form.setFieldValue('amount' + index, amount)
        formData.material_details[index] = {
            ...materialDetails
        };
        const totalAmount = getTotalAmount();
        formData.total_amount = totalAmount > 0 ? totalAmount * 0.13 + totalAmount : formData.total_amount;
        formData.hst_amount = totalAmount > 0 ? totalAmount * 0.13 : formData.hst_amount;
        if (totalAmount > 0) {
            form.setFieldsValue({ 'hst_amount': (totalAmount * 0.13).toFixed(2) || 0 });
            form.setFieldsValue({ 'total_amount': (totalAmount * 0.13 + totalAmount).toFixed(2) || 0 });
        }
    }

    const onFinish = () => {
        updatePO({
            ...formData,
            po_id: id,
        }).then((res) => {
            if (res?.data?.status) {
                router.push('/po_list');
            }
        });
    }

    const onChange = (name, value, index) => {
        if (name === 'material_details') {
            const materalDetails = formData.material_details[index];
            Object.keys(value).forEach((key) => {
                materalDetails[key] = value[key];
            });

            if (value.unit_price) {
                calculateAmount(formData.material_details[index].quantity, value.unit_price, index);
            }
            if (value.quantity) {
                calculateAmount(value.quantity, formData.material_details[index].unit_price, index);
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
            if (res?.data?.status) {
                message.success(res.data?.message);
                setIsModalOpen(false);
                setRefetch(true);
            }
        }).catch((error) => {
            message.error(error.response.data.message)
        })
    }

    const handleIconClick = () => {
        setStatusModalOpen(true);
    };

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
                                    <span>View Purchase Order</span>
                                </div>
                                <div>
                                    {
                                       ( formData.status === 'approved' || formData.status === 'rejected') && formData.notes?.length > 0 && <button className="po-status-btn" onClick={() => handleIconClick()}>
                                            PO Status
                                        </button>
                                    }

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
                                </div>
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
                                                            {/* <Option value="subcontractor">Sub Contractor PO</Option> */}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <PoForm formData={formData} view={true} edit={true} isNew={false} form={form} onChange={onChange} onFinish={onFinish} getTotalAmount={getTotalAmount} setFormData={setFormData} />
                                </Form>
                            </div>

                        </div>
                        {history?.length > 0 && <Amendments history={history} />}
                    </div>
                </div>
                {isModalOpen && <ChangeStatus po_id={id} poType={"material"} handleStatusChange={handleStatusChange} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
                {isStatusModalOpen && <PoStatus isStatusModalOpen={isStatusModalOpen} data={formData.notes} setStatusModalOpen={setStatusModalOpen} />}
            </div>
        </>
    );
};

export { getServerSideProps };
export default ViewMaterialPo;
