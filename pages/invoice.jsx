import React, { useEffect, useState } from "react";
import '../styles/style.css';
import { EyeFilled, EditFilled } from '@ant-design/icons'
import { Button, Select, } from 'antd';
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { PlusOutlined } from '@ant-design/icons'
import { invoiceList } from "@/apis/apis/adminApis";
import Roles from "@/components/Roles";

const { Option } = Select;

const Invoice = () => {
    const [invoiceTable, setInvoiceTable] = useState([]);
    const [invoice,setInvoice]=useState(0);
    const [pendingInvoice,setPendingInvoice]=useState(0)
    useEffect(() => {
        const response = invoiceList();
        response.then((res) => {
            if(res?.data?.status) {
                setInvoiceTable(res.data.data)
                setInvoice(res.data.total_invoice)
                setPendingInvoice(res.data.total_pending_invoice)
            }
        })
    }, [])

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <div className="top-wrapp">
                        <div className="text-wrap">
                            <h5>Invoice</h5>
                        </div>
                        <div className="notify">
                            <div className="leftwrap">
                                <img src="./images/notification.svg" alt="" />
                                <span>1</span>
                            </div>
                            <div className="user">
                                <span>John Smith</span><img src="./images/profile.png" alt="" className="ms-2" />
                            </div>
                        </div>
                    </div>
                    <div className="bottom-wrapp-purchase">
                        <ul className="list-icons">
                            {
                                <Roles action="add_invoice">
                                    <li class="me-4 ">
                                        <Link href='/create_invoice'>  <PlusOutlined class="fa-solid fa-plus mb-3" /></Link>
                                        {/* <i class="fa-solid fa-plus mb-3"></i> */}
                                        <span  className="mt-3">Add Invoice</span>
                                    </li>
                                </Roles>
                            }
                            <li className="me-4">
                                <span className="text-size mb-3">{pendingInvoice}</span>

                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <span>Pending Invoice</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size green-bg-span mb-3">{invoice}</span>
                                <span>Total Invoice</span>
                            </li>
                        </ul>
                        <div className="searchbar-wrapper">
                            <div className="Purchase-form">
                                <form className="search-purchase gap-0">
                                    <input className="vendor-input" placeholder="Search Invoice" />
                                    <Button className="vendor-search-butt">Search</Button>
                                </form>
                                <div className="purchase-filter">
                                    <span className="filter-span">Filter :</span>
                                    <Select className="line-select me-2" placeholder="Type">
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>
                                    {/* -------------------------- */}

                                    <Select className="line-select me-2" placeholder="PO Vendor" >
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>
                                    <Select className="line-select" placeholder="PO Status" >
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>

                                    {/* <Button className="click-btn"><span>Type</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Vendor</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Status</span><i className="fa-solid fa-chevron-down"></i></Button> */}
                                </div>
                            </div>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <h5>Invoices</h5>
                            <div className="inner-table" id="inner-purchase">
                                <table id="" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S. No</th>
                                            <th className="hedaings-tb">PO No.</th>
                                            <th className="hedaings-tb">Created By</th>
                                            <th className="hedaings-tb">PO Amount</th>
                                            <th className="hedaings-tb td-color">PO Vendor</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th className="hedaings-tb">PM</th>
                                            <th className="hedaings-tb">DM</th>
                                            <th className="hedaings-tb">Site Supervisor</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(invoiceTable) &&
                                            invoiceTable.map((invoice, index) =>(
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{invoice.purchase_order.po_number}</td>
                                                    <td>{invoice.purchase_order.created_by.first_name} {invoice.purchase_order.created_by.last_name}</td>
                                                    <td>{invoice.purchase_order.total_amount}</td>
                                                    <td>{invoice.purchase_order.vendor_contact.name}</td>
                                                    <td>{invoice.purchase_order.status}</td>
                                                    {/* <td style={{ color: invoice.pm_approved ? 'green' : 'red' }}>
                                                        {invoice.pm_approved ? '✔' : '❌'}
                                                    </td> */}
                                                    {/* <td>
                                                        {invoice.pm_approved ? <CheckCircleFilled style={{ color: 'green' }} /> : <CloseCircleFilled style={{ color: 'red' }} />}
                                                    </td> */}
                                                    <td>{invoice.pm_approved ? "true" : "false"}</td>
                                                    {/* <td>{invoice.pm_approved|| "N/A"}</td> */}
                                                    <td>{invoice.dm_approved ? "true" : "false"}</td>
                                                    <td>{invoice.site_supervisor_approved ? "true" : "false"}</td>
                                                    <td>
                                                        <Link href={`/view-invoice/${invoice.invoice_id}`} className="me-1"><EyeFilled /></Link>
                                                        {
                                                            <Roles action="edit_invoice">
                                                                <Link href={`/edit-invoice/${invoice.invoice_id}`} className="me-1"><EditFilled /></Link>
                                                            </Roles>
                                                        }
                                                    </td>

                                                </tr>
                                            )
                                            )}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}

export default Invoice;