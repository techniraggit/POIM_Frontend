import { filterSearchPo, getPoList, poReport, clearPoList } from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { message, Popconfirm, Pagination, Button, Select } from 'antd';
// import { saveAs } from "file-saver";

const { Option } = Select;
const purchaseOrderReport = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [count, setCount] = useState('')

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
            const response = filterSearchPo(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setPurchaseOrders(res.data.results.data);
                setPurchaseOrders(res.data.results.search_query_data)
            });
        } else {
            getPoList(currentPage).then((res) => {
                if (res?.data?.results?.status) {
                    setPurchaseOrders(res.data.results.data || []);
                }
                setCount(res.data.count)
            })
        }
    }, [currentPage, query.filter_by_po_type, query.filter_by_po_status, query.from_date, query.to_date]);
    const rows = purchaseOrders?.filter((order) => {
        return order.po_type.toLowerCase().includes(search.toLowerCase()) ||
            order.vendor_contact.name.toLowerCase().includes(search.toLowerCase())
    }) || [];
    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    const downloadPdf = () => {

        const queryString = new URLSearchParams({
            ...query,
            page: currentPage
        }).toString();
        const response = poReport(queryString);
        response.then((res) => {
            if (res.data) {
                const fileName = `report.xlsx`;
                saveAs(res.data, fileName)
            }
        })
    }

    const handleFilterClearButton = () => {
        setQuery(prevState => ({
            ...prevState,
            ['filter_by_po_status']: '',
            ['filter_by_po_type']: "",
            ['from_date']: "",
            ['to_date']: "",

        }))
        clearPoList().then((res) => {
            setPurchaseOrders(res.data.results.data);
            setCount(res.data.count)
        })
    }
    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="PO Report" />
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
                                <table id="purcahse-tablewrap" class="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th class="hedaings-tb">S. No</th>
                                            <th class="hedaings-tb">PO No.</th>
                                            <th class="hedaings-tb">Project No.</th>
                                            <th class="hedaings-tb">Po Type</th>
                                            <th class="hedaings-tb">PO Creation Date</th>
                                            <th class="hedaings-tb">PO Amount</th>
                                            <th class="hedaings-tb">Created By</th>
                                            <th class="hedaings-tb">PO Status</th>
                                            <th class="hedaings-tb">PO Vender</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(rows) && rows.length > 0 ? (
                                            rows.map((purchase, index) => {
                                                return <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{purchase.po_number}</td>
                                                    <td>{purchase.project?.project_no || '-'}</td>
                                                    <td className="td-color">{purchase.po_type}</td>
                                                    <td>{new Date(purchase.po_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</td>
                                                    <td>{purchase.total_amount}</td>
                                                    <td>{purchase.created_by.first_name} {purchase.created_by.last_name}</td>
                                                    <td>{purchase.status}</td>
                                                    <td>{purchase.vendor_contact?.name}</td>
                                                    {/* <td>
                                                        <div class="icons-td justify-content-between"> <span>Turner Constructions</span>
                                                            <div><i class="fa-solid fa-eye me-1"></i>
                                                                <i class="fa-solid fa-download"></i>
                                                            </div>
                                                        </div>
                                                    </td> */}

                                                </tr>
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="8">No purchase orders available</td>
                                            </tr>
                                        )}

                                        {/* <tr>
                                            <td>{calculateStartingSerialNumber() + index}</td>
                                            <td>{purchase.po_number}</td>
                                            <td>{purchase.project?.project_no || '-'}</td>
                                            <td></td>
                                            <td className="td-color">{purchase.po_type}</td>
                                            <td>{new Date(purchase.po_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}</td>
                                            <td>{purchase.total_amount}</td>
                                            <td>{purchase.status}</td>
                                            <td>{purchase.vendor_contact?.name}</td>
                                            <td>
                                                <div class="icons-td justify-content-between"> <span>Turner Constructions</span>
                                                    <div><i class="fa-solid fa-eye me-1"></i>
                                                        <i class="fa-solid fa-download"></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="pagination-container">
                            <Pagination
                                // defaultCurrent={2}
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
export default purchaseOrderReport
