import React, { useEffect, useState } from "react";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import '../../styles/style.css'
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useRouter } from "next/router";
import { fetchPo, updatePo, changeStatus, uploadContract, downloadContract } from "@/apis/apis/adminApis";
import { Form, Input, Select, Button, message, Upload } from "antd";
import moment from "moment";
import PoForm from "@/components/Form";
import PoStatus from "@/components/PoStatus";
import ChangeStatus from "@/components/PoChangeStatus";
import Roles from "@/components/Roles";
import { saveAs } from "file-saver";
import Amendments from "@/components/Amendments";


const { Option } = Select;

const ViewSubContractorPo = () => {
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
    const [isModalOpen, setIsModalOpen] = useState({
        modalStatus: false,
        action: ''
    });
    const [history, setHistory] = useState([])
    const [refetch, setRefetch] = useState(true);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [contractFile, setContractFile] = useState(null)

    const router = useRouter();
    const [form] = Form.useForm();
    const { id } = router.query;

    useEffect(() => {
        if (refetch) {
            form.setFieldValue('po_type', 'subcontractor');
            fetchPo(id).then((res) => {
                if (res?.data?.status) {
                    const data = res.data.data;
                    setFormData({
                        ...formData,
                        po_type: data.po_type,
                        created_by: data.created_by,
                        can_change_status: res?.data?.can_change_status,
                        amount: data.total_amount,
                        po_date: data.po_date,
                        subcontractor_type: data.subcontractor_type,
                        invoice_amount: data.invoice_received_amount,
                        original_po_amount: data.total_amount,
                        company_name: data.vendor_contact.company.company_name,
                        vendor_id: data.vendor_contact.company.vendor_id,
                        vendor_contact_id: data.vendor_contact.vendor_contact_id,
                        hst_amount: data.hst_amount,
                        total_amount: data.total_amount,
                        project_site_id: data.project_site,
                        project_id: typeof data.project === 'object' ? data.project?.project_id : data.project,
                        country: data.vendor_contact.company.country,
                        state: data.vendor_contact.company.state,
                        address: data.vendor_contact.company.address,
                        phone: data.vendor_contact.phone_number,
                        email: data.vendor_contact.email,
                        shipment_type: data.shipment_type || 'project related',
                        material_details: data.material_details.map((detail) => {
                            return {description:detail.description,date:detail.date,amount:detail.amount,md_id:detail.md_id, project_site_id: detail?.project_site?.site_id }
                        }),
                        // material_details: [...data.material_details],
                        status: data.status,
                        notes: data?.co_approved_amount,
                        signed_contract: data.signed_contract,
                        co_amount:data.co_approved_amount[0]?.amount,
                        po_creator: res?.data?.po_creator
                    });
                    setHistory([...res.data.history_logs_data])

                    form.setFieldValue('co_amount', data.co_approved_amount[0]?.amount.toLocaleString());
                    form.setFieldValue('po_type', data.po_type);
                    form.setFieldValue('company_name', data.vendor_contact.company.company_name)
                    form.setFieldValue('vendor_id', data.vendor_contact?.company?.is_deleted ? data.vendor_contact?.company.company_name : data.vendor_contact?.company.vendor_id);
                    form.setFieldValue('vendor_contact_id', data.vendor_contact.vendor_contact_id);
                    form.setFieldValue('hst_amount', (data.hst_amount).toLocaleString()) || 0;
                    form.setFieldValue('total_amount', data.total_amount.toLocaleString());
                    form.setFieldValue('project_id', typeof data.project === 'object' ? data.project?.is_deleted ? data.project.name : data.project?.project_id : data.project);
                    form.setFieldValue('poDate', moment(data.po_date));
                    form.setFieldValue('country', data.vendor_contact.company.country);
                    form.setFieldValue('state', data.vendor_contact.company.state);
                    form.setFieldValue('address', data.vendor_contact.company.address);
                    form.setFieldValue('phone', data.vendor_contact.phone_number.slice(2));
                    form.setFieldValue('email', data.vendor_contact.email);
                    form.setFieldValue('poNumber', data.po_number)
                    form.setFieldValue('shipment_type', data.shipment_type || 'project related')
                    form.setFieldValue('amount0', data.material_details[0]?.amount)
                    form.setFieldValue('description', data.material_details[0]?.description)
                    form.setFieldValue('material_site_id', data.material_details[0]?.project_site)
                    form.setFieldValue('first_name', data.created_by.first_name)
                    form.setFieldValue('last_name', data.created_by.last_name);
                    form.setFieldValue('original_po_amount', data.total_amount.toLocaleString());
                    form.setFieldValue('last_name', data.created_by.last_name);
                    form.setFieldValue('subcontractor_type', data.subcontractor_type);
                    form.setFieldValue('invoice_amount', data.invoice_received_amount);
                    data?.material_details.forEach((material, index) => {
                        form.setFieldValue('project_site_id' + (index), material.project_site?.site_id)
                        form.setFieldValue('material_for' + (index), material.material_for)
                        form.setFieldValue('project_id' + (index), material.project === 'object' ? material.project?.is_deleted ? material.project.name : material.project?.project_id : material.project)
                        form.setFieldValue('amount' + (index), material.amount.toLocaleString())
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
        })
    }
    const handleIconClick = () => {
        setStatusModalOpen(true);
    };

    const uploadContractFile = () => {
        const formData = new FormData();
        formData.append('po_id', id);
        formData.append('contract_file', contractFile);
        const response = uploadContract(formData);
        response.then((res) => {
            if (res?.data?.status) {
                setRefetch(true);
            }
        })
    }

    const beforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('Only PDF files are allowed!');
        }
        return isPDF;
    };

    const handleDownload = (name, contract_id) => {
        const response = downloadContract({
            id: id,
            contract_id
        });
        response.then((res) => {
            if (res.data) {
                saveAs(res.data, name);
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
                            <li class="bg-li-invoice justify-content-between d-flex align-items-center">
                                <div className="plus-wraptext d-flex align-items-center">
                                    <PlusOutlined className="me-3" />
                                    <span>View Purchase Order</span>
                                </div>
                                {
                                    (formData.status === 'approved' || formData.status === 'rejected') && formData.notes?.length > 0 && <button className="po-status-btn" onClick={() => handleIconClick()}>
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
                                                                readOnly
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
                                                                readOnly
                                                                addonBefore="$"
                                                                onChange={({ target: { value } }) => onChange('invoice_amount', value)} placeholder="Invoice Recieved Amount" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    }
                                    <PoForm formData={formData} view={true} edit={true} isNew={true} form={form} onChange={onChange} onFinish={onFinish} setFormData={setFormData} />
                                </Form>
                            </div>
                            {formData.status === 'approved' && formData.po_creator && <>
                                <p>Upload Contract File</p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item
                                        className="select-file-invoice"
                                        valuePropName="fileList"
                                    >
                                        <Upload onChange={(e) => {
                                            setContractFile(e.fileList[0].originFileObj);
                                        }} beforeUpload={beforeUpload} accept=".pdf" maxCount={1} className="upload-filewrap" >
                                            <Button icon={<UploadOutlined />} className="file-btn" >Select File</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item style={{
                                        marginLeft: '10px'
                                    }}>
                                        <Button onClick={uploadContractFile} type="primary">
                                            Upload
                                        </Button>
                                    </Form.Item>
                                </div>
                            </>}
                            {formData.status === 'approved' && formData.po_creator && formData.signed_contract?.length > 0 && <div className="download-wrap d-flex" style={{
                                flexDirection: 'column', gap: 10, marginTop: 10
                            }}>
                                {
                                    formData.signed_contract.map((contract) => {
                                        const split_file_name = contract.contract_file.split('/');
                                        const fileName = split_file_name[split_file_name.length - 1];
                                        return <div className="download-fine-invoice">
                                            {fileName} <DownloadOutlined onClick={() => handleDownload(fileName, contract.contract_id)} />
                                        </div>
                                    })
                                }
                            </div>}
                        </div>
                        {history?.length > 0 && <Amendments history={history} />}
                    </div>
                </div>
            </div>
            {isModalOpen && <ChangeStatus po_id={id} poType={"subcontractor"} handleStatusChange={handleStatusChange} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
            {isStatusModalOpen && <PoStatus isStatusModalOpen={isStatusModalOpen} data={formData.notes} setStatusModalOpen={setStatusModalOpen} />}
        </>
    );
};

export { getServerSideProps };

export default ViewSubContractorPo;