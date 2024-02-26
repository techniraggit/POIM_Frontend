import React, { useEffect, useState } from "react";
import '../styles/style.css';
import { EyeFilled, EditFilled } from '@ant-design/icons'
import { Button, Pagination } from 'antd';
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { PlusOutlined } from '@ant-design/icons'
import { filterSearch, invoiceList } from "@/apis/apis/adminApis";
import Roles from "@/components/Roles";
import Header from "@/components/header";
import Filters from "@/components/Filters";

const Invoice = () => {
    const [invoiceTable, setInvoiceTable] = useState([]);
    const [invoice, setInvoice] = useState(0);
    const [pendingInvoice, setPendingInvoice] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('');

    const getInvoiceList = () => {
        invoiceList(currentPage).then((res) => {
            if (res?.data?.results.status) {
                setInvoiceTable(res.data.results.data || [])
                setInvoice(res.data.results.total_invoice)
                setPendingInvoice(res.data.results.total_pending_invoice)
            }
            setCount(res.data.count)
        })
    }

    const applyFilters = (data) => {
        if(typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({ ...data, page: currentPage }).toString();
            const response = filterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setInvoiceTable(res.data.results.data)
                setInvoiceTable(res.data.results.search_invoice_data)
            })
        } else {
            getInvoiceList();
        }
    }

    useEffect(() => {
        getInvoiceList();
    }, []);

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Invoice' />
                    <div className="bottom-wrapp-purchase">
                        <ul className="list-icons">
                            {
                                <Roles action="add_invoice">
                                    <li class="me-4 ">
                                        <Link href='/create_invoice'>  <PlusOutlined class="fa-solid fa-plus mb-3" /></Link>
                                        <span className="mt-3">Add Invoice</span>
                                    </li>
                                </Roles>
                            }
                            <li className="me-4">
                                <span className="text-size mb-3">{pendingInvoice}</span>

                                <span>Pending Invoice</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size green-bg-span mb-3">{invoice}</span>
                                <span>Total Invoice</span>
                            </li>
                        </ul>
                        <Filters search={true} type={true} vendor={true} status={true} applyFilters={applyFilters} currentPage={currentPage} />
                        <div className="table-wrap vendor-wrap">
                            <h5>Invoices</h5>
                            <div className="inner-table" id="inner-purchase">
                                {Array.isArray(invoiceTable) && invoiceTable.length > 0 ? (
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
                                                <th className="hedaings-tb">Po Creator</th>
                                                <th className="hedaings-tb">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceTable.map((invoice, index) => (
                                                <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{invoice.purchase_order.po_number}</td>
                                                    <td>{invoice.purchase_order.created_by.first_name} {invoice.purchase_order.created_by.last_name}</td>
                                                    <td>{invoice.purchase_order.total_amount}</td>
                                                    <td>{invoice.purchase_order.vendor_contact.name}</td>
                                                    <td>{invoice.purchase_order.status}</td>
                                                    <td>{invoice.pm_approval_status}</td>
                                                    <td>{invoice.dm_approval_status}</td>
                                                    <td>{invoice.po_creator_approval_status}</td>
                                                    <td>
                                                        <Link href={`/view-invoice/${invoice.invoice_id}`} className="me-1"><EyeFilled /></Link>
                                                        <Roles action="edit_invoice">
                                                            <Link href={`/edit-invoice/${invoice.invoice_id}`} className="me-1"><EditFilled /></Link>
                                                        </Roles>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="no-data-p">No data found.</p>
                                )}
                            </div>
                        </div>
                        <div className="pagination-container">
                            <Pagination
                                current={currentPage}
                                onChange={setCurrentPage}
                                showSizeChanger={true}
                                prevIcon={
                                    <Button
                                        style={currentPage === 1 ? { pointerEvents: 'none', opacity: 0.5 } : null}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Previous
                                    </Button>
                                }
                                nextIcon={
                                    <Button
                                        style={currentPage === Math.ceil(count / 10) ? { pointerEvents: 'none', opacity: 0.5 } : null}
                                        disabled={currentPage === Math.ceil(count / 10)}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </Button>
                                }
                                onShowSizeChange={() => setCurrentPage(+1)}
                                total={count}
                                pageSize={10}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Invoice;
