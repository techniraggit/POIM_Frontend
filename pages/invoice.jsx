import React, { useEffect, useState } from "react";
import '../styles/style.css';
import { EyeFilled, EditFilled } from '@ant-design/icons'
import { Button, Select, } from 'antd';
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { PlusOutlined } from '@ant-design/icons'
import { invoiceList } from "@/apis/apis/adminApis";


const { Option } = Select;

const Invoice = () => {
    const [invoiceTable, setInvoiceTable] = useState([]);
    useEffect(() => {
        const response = invoiceList();
        response.then((res) => {
            console.log(res.data.invoice_data, 'lllllllllllllllll');
            setInvoiceTable(res.data.invoice_data)
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
                            <li class="me-4 ">
                                <Link href='/create_invoice'>  <PlusOutlined class="fa-solid fa-plus mb-3" /></Link>
                                {/* <i class="fa-solid fa-plus mb-3"></i> */}
                                <span>Add Invoice</span>
                            </li>
                            <li className="me-4">
                                <span className="text-sizes mb-3">5</span>

                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <span>Pending Invoice</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mb-3">224</span>
                                <span>Total Invoice</span>
                            </li>
                        </ul>
                        <div className="searchbar-wrapper">
                            <div className="Purchase-form">
                                <form className="search-purchase">
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
                            <h5>Purchase Orders</h5>
                            <div className="inner-table" id="inner-purchase">
                                <table id="" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S. No</th>
                                            <th className="hedaings-tb">Invoice No.</th>
                                            <th className="hedaings-tb">PO No.</th>
                                            <th className="hedaings-tb">Created By</th>
                                            <th className="hedaings-tb">PO Amount</th>
                                            <th className="hedaings-tb td-color">PO Vendor</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(invoiceTable) &&
                                            invoiceTable.map((invoice, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{invoice.invoice_number}</td>
                                                    <td>{invoice.purchase_order.po_number}</td>
                                                    <td>{invoice.purchase_order.created_by.first_name} {invoice.purchase_order.created_by.last_name}</td>
                                                    <td>{invoice.purchase_order.total_amount}</td>
                                                    <td>{invoice.purchase_order.vendor_contact.name}</td>
                                                    <td>{invoice.purchase_order.status}</td>
                                                    <td>
                                                        <EyeFilled />
                                                        <EditFilled />
                                                    </td>
                                                    {/* <td className="td-color">{user.last_name}</td>
                                                    <td>{user.user_role.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone_number}</td>
                                                    <td className="td-icon-color">
                                                        <EyeFilled onClick={() => handleIconClick(user.id)} />
                                                        {isViewUserVisible === user.id && <UserPopUp user_id={user.id} />}
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this item?"
                                                            onConfirm={() => handleDelete(user.id)}
                                                            okText="Yes"
                                                            cancelText="No"

                                                        >
                                                            <DeleteFilled />
                                                        </Popconfirm>
                                                        <Link href={`/edit_user/${user.id}`} className="me-2"><EditFilled /></Link>
                                                    </td> */}
                                                </tr>
                                            ))}
                                        {/* <tr>
                                            <td>1</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Teri Dactyl</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Olive Yew</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />

                                                <EditFilled />

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Sam Billings</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>7</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>Rental</td>
                                            <td className="td-color">Sam Billings</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>8</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <EyeFilled />
                                                <EditFilled />
                                            </td>
                                        </tr> */}
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