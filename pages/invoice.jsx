import React, { useEffect, useState } from "react";
import '../styles/style.css';
import { EyeFilled, EditFilled } from '@ant-design/icons'
import { Button, Select, Pagination } from 'antd';
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { PlusOutlined } from '@ant-design/icons'
import { fetchVendorContact, filterSearch, invoiceList } from "@/apis/apis/adminApis";
import Roles from "@/components/Roles";
import Header from "@/components/header";
import { invoiceClear, invoiceSearch } from "@/apis/apis/adminApis";

const { Option } = Select;

const Invoice = () => {
    const [invoiceTable, setInvoiceTable] = useState([]);
    const [invoice, setInvoice] = useState(0);
    const [pendingInvoice, setPendingInvoice] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    const [companyName, setCompanyName] = useState([]);

    const [query, setQuery] = useState({
        filter_by_po_type: "",
        filter_by_po_vendor: "",
        filter_by_po_status: ""
    })
    useEffect(() => {
        invoiceList(currentPage).then((res) => {
            if (res?.data?.results.status) {
                setInvoiceTable(res.data.results.data)
                setInvoice(res.data.results.total_invoice)
                setPendingInvoice(res.data.results.total_pending_invoice)
            }
            setCount(res.data.count)
        })
    }, [currentPage])

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async (event) => {
        event.preventDefault();
        invoiceSearch(inputValue).then((response) => {
            setInvoiceTable(response.data.search_invoice_data)

        })

    };
    const handleClearButtonClick = () => {
        setInputValue('');
        invoiceClear().then((res) => {
            setInvoiceTable(res.data.data)
        })
    };

    useEffect(() => {

        const response = fetchVendorContact();
        response.then((res) => {
            setCompanyName([...res.data.vendors])
        })

    }, [])


    useEffect(() => {
        if (query) {
            const queryString = new URLSearchParams(query).toString();
            const response = filterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setInvoiceTable(res.data.results.data)
                setInvoiceTable(res.data.results.search_invoice_data)
            })
            // setCount(res.data.count)
        }
    }, [query])
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
                                <div className="wrapin-form add-clear-wrap mt-0">
                                    <form className="search-vendor">
                                        <input className="vendor-input" placeholder="Search Vendor"
                                            value={inputValue} onChange={handleInputChange}
                                        />
                                        <button className="vendor-search-butt"
                                            onClick={handleButtonClick}
                                        >Search</button>
                                    </form>
                                    <button type="submit" className="clear-button ms-3"
                                        onClick={handleClearButtonClick}
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="purchase-filter">
                                    <span className="filter-span">Filter :</span>

                                    <Select placeholder="Select PO Type" id="single1"
                                        class="js-states form-control file-wrap-select bold-select"
                                        onChange={(value) =>

                                            setQuery(prevState => ({
                                                ...prevState,
                                                ['filter_by_po_type']: value
                                            }))
                                        }
                                    >
                                        <Option value="material">Material PO</Option>
                                        <Option value="rental">Rental PO</Option>
                                        <Option value="subcontractor">Sub Contractor PO</Option>
                                    </Select>
                                    <Select className="line-select me-2" placeholder="PO Vendor"
                                        onChange={(value) =>
                                            setQuery(prevState => ({
                                                ...prevState,
                                                ['filter_by_po_vendor']: value
                                            }))}

                                    >
                                        {companyName.map((entry) =>

                                        (
                                            <Select.Option key={entry.vendor_id} value={entry.vendorId}>
                                                {entry.company_name}
                                            </Select.Option>
                                        )
                                        )}

                                    </Select>
                                    <Select className="line-select me-2" placeholder="PO Status"
                                        onChange={(value) =>
                                            setQuery(prevState => ({
                                                ...prevState,
                                                ['filter_by_po_status']: value
                                            }))}


                                    >
                                        <Option value="pending">Pending</Option>
                                        <Option value="approved">Approved</Option>
                                        <Option value="rejected">Rejected</Option>
                                    </Select>


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
                                            <th className="hedaings-tb">DM/Admin</th>
                                            <th className="hedaings-tb">Po Creator</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(invoiceTable) &&
                                            invoiceTable.map((invoice, index) => (
                                                <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
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
                                                    <td>{invoice.pm_approval_status}</td>
                                                    {/* <td>{invoice.pm_approved|| "N/A"}</td> */}
                                                    <td>{invoice.dm_approval_status}</td>
                                                    <td>{invoice.po_creator_approval_status}</td>
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
                        <div className="pagination-container">
                        <Pagination
                            // defaultCurrent={2}
                            current={currentPage}
                            //  onChange={handlePaginationChange}
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
                            pageSize={10} // Number of items per page

                        />
                    </div>
                    </div>
                   
                </div>
            </div>

        </>
    )

}

export default Invoice;