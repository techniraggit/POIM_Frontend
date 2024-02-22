import { invoiceList, filterSearch, invoiceReportPdf, invoiceClear } from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { message, Popconfirm, Pagination, Button, Select } from 'antd';
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { EyeFilled, DownloadOutlined } from '@ant-design/icons'

const { Option } = Select;
const invoiceReport = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    const [invoiceTable, setInvoiceTable] = useState([]);
    const [query, setQuery] = useState({
        filter_by_po_type: "",
        to_date: "",
        from_date: '',
        filter_by_po_status: ""
    })


    useEffect(() => {
        if (query.filter_by_po_type || query.filter_by_po_status || query.from_date || query.to_date) {
            const queryString = new URLSearchParams({
                ...query,
                page: currentPage
            }).toString();
            const response = filterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setInvoiceTable(res.data.results.data)
                setInvoiceTable(res.data.results.search_invoice_data)
            })
        } else {
            invoiceList(currentPage).then((res) => {
                console.log(res, 'sssssppppppppppppppp');
                if (res?.data?.results.status) {
                    setInvoiceTable(res.data.results.data || [])
                }
                setCount(res.data.count)
            })
        }
    }, [currentPage, query.filter_by_po_type, query.filter_by_po_status, query.from_date, query.to_date]);

    const downloadPdf = () => {
        const queryString = new URLSearchParams({
            ...query,
            page: currentPage
        }).toString();
        const response = invoiceReportPdf(queryString);
        response.then((res) => {
            if (res.data) {
                const fileName = `report.xls`;
                saveAs(res.data, fileName)
            }
        })
    }

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    const handleFilterClearButton = () => {
        // router.reload();

        setQuery(prevState => ({
            ...prevState,
            ['filter_by_po_status']: '',
            ['to_date']: "",
            ['from_date']: "",
            ['filter_by_po_type']: ""
        }))
        invoiceClear().then((res) => {
            setInvoiceTable(res.data.results.data)
            setCount(res.data.count)

        })

    }
    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Invoice Report" />
                    <div class="bottom-wrapp">
                        <ul class="list-icons text-list-icons">
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total Users</span>
                            </li>
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total Vendors</span>
                            </li>
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total Customers</span>
                            </li>
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total PO</span>
                            </li>
                            <li>
                                <span class="text-size mb-3">200</span>
                                <span>Total Invoices</span>
                            </li>
                        </ul>
                        <div class="filter-po-report">
                            <form action="#" class="poreport-form">
                                <div class="firstly-wrap">
                                    <p class="filt-er mb-0 me-1">Filter</p>
                                    <div class="date-wrapp me-1"> <label for="">{query.from_date || "From Date"}</label>
                                        <input type="date" class="input-date" placeholder=""
                                            onChange={(event) => {
                                                console.log(event.target, event)
                                                const selectedDate = event.target.value;
                                                setQuery(prevState => ({
                                                    ...prevState,
                                                    from_date: selectedDate
                                                }));
                                            }}

                                            value={query['from_date']}
                                        />
                                    </div>
                                    <div class="date-wrapp me-1"> <label for="">{query.to_date || "To Date"}</label>
                                        <input type="date" class="input-date" placeholder=""
                                            onChange={(event) => {
                                                const selectedDate = event.target.value;
                                                const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                                                setQuery(prevState => ({
                                                    ...prevState,
                                                    to_date: formattedDate
                                                }));
                                            }}

                                            value={query['to_date']}
                                        />
                                    </div>
                                    <div class="wrapper-selected me-0 d-flex">
                                        <Select placeholder=" Type" id="po1"
                                            className="line-select me-2"
                                            onChange={(value) =>
                                                setQuery(prevState => ({
                                                    ...prevState,
                                                    ['filter_by_po_type']: value
                                                }))}
                                            value={query['filter_by_po_type'] || "PO Type"}

                                        >
                                            <Option value="material">Material PO</Option>
                                            <Option value="rental">Rental PO</Option>
                                            <Option value="subcontractor">Sub Contractor PO</Option>
                                        </Select>
                                        <div class="one-select ms-2">
                                            <Select className="line-select me-2" placeholder="PO Status"
                                                onChange={(value) =>
                                                    setQuery(prevState => ({
                                                        ...prevState,
                                                        ['filter_by_po_status']: value
                                                    }))}
                                                value={query['filter_by_po_status'] || "PO Status"}

                                            >
                                                <Option value="pending">Pending</Option>
                                                <Option value="approved">Approved</Option>
                                                <Option value="rejected">Rejected</Option>
                                            </Select>
                                            <button type="submit" className="clear-button ms-3"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFilterClearButton()
                                                }}
                                            >
                                                Clear
                                            </button>

                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" class="export-btn" onClick={downloadPdf}>Export To XLS</Button>
                            </form>
                        </div>
                        <div class="table-wrap vendor-wrap" id="space-report">
                            <div class="inner-table" id="inner-purchase">
                                {Array.isArray(invoiceTable) && invoiceTable.length > 0 ? (
                                    <table id="purcahse-tablewrap" class="table-hover">
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
                                                {/* <th className="hedaings-tb">Action</th> */}
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
                                                    {/* <td>
                                                        <div class="icons-td justify-content-between"> <span>Turner Constructions</span>
                                                            <div><EyeFilled />
                                                            <DownloadOutlined />
                                                            </div>
                                                        </div>
                                                    </td> */}
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
                                pageSize={10} // Number of items per page

                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default invoiceReport