import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect } from "react";
import { message, Popconfirm, Pagination, Button, Select } from 'antd';
import ReportHeader from "@/components/ReportHeader";
import { getSubcontractorReport } from "@/apis/apis/adminApis";

const { Option } = Select;
const SubcontractorReport = () => {
    // const [query, setQuery] = useState({
    //     filter_by_po_type: "",
    //     to_date: "",
    //     from_date: '',
    //     filter_by_po_status: ""
    // })

    useEffect(() => {
        const response = getSubcontractorReport();
        response.then((res) => {
            console.log(res)
        })
    }, []);

    return(
        <>
            <div className="wrapper-main">
                <Sidebar/>
                <div className="inner-wrapper">
                    <Header heading="Subcontractor Report" />
                    <div class="bottom-wrapp">
                            <ReportHeader />
                            <div class="filter-po-report">
                                <form action="#" class="poreport-form">
                                    <div class="firstly-wrap">
                                        <p class="filt-er mb-0 me-1">Filter</p>
                                        <div class="date-wrapp me-1"> <label for="">"From Date"</label>
                                            <input type="date" class="input-date" placeholder=""
                                                // onChange={(event) => {
                                                //     console.log(event.target, event)
                                                //     const selectedDate = event.target.value;
                                                //     setQuery(prevState => ({
                                                //         ...prevState,
                                                //         from_date: selectedDate
                                                //     }));
                                                // }}

                                                // value={query['from_date']}
                                            />
                                        </div>
                                        <div class="date-wrapp me-1"> <label for="">"To Date"</label>
                                            <input type="date" class="input-date" placeholder=""
                                                // onChange={(event) => {
                                                //     const selectedDate = event.target.value;
                                                //     const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                                                //     setQuery(prevState => ({
                                                //         ...prevState,
                                                //         to_date: formattedDate
                                                //     }));
                                                // }}

                                                // value={query['to_date']}
                                            />
                                        </div>
                                        <div class="wrapper-selected me-0 d-flex">
                                            <Select placeholder=" Type" id="po1"
                                                className="line-select me-2"
                                                // onChange={(value) =>
                                                //     setQuery(prevState => ({
                                                //         ...prevState,
                                                //         ['filter_by_po_type']: value
                                                //     }))}
                                                // value={query['filter_by_po_type'] || "PO Type"}

                                            >
                                                <Option value="material">Material PO</Option>
                                                <Option value="rental">Rental PO</Option>
                                                <Option value="subcontractor">Sub Contractor PO</Option>
                                            </Select>
                                            <div class="one-select ms-2">
                                                <Select className="line-select me-2" placeholder="PO Status"
                                                    // onChange={(value) =>
                                                    //     setQuery(prevState => ({
                                                    //         ...prevState,
                                                    //         ['filter_by_po_status']: value
                                                    //     }))}
                                                    // value={query['filter_by_po_status'] || "PO Status"}

                                                >
                                                    <Option value="pending">Pending</Option>
                                                    <Option value="approved">Approved</Option>
                                                    <Option value="rejected">Rejected</Option>
                                                </Select>
                                                <button type="submit" className="clear-button ms-3"
                                                    // onClick={(e) => {
                                                    //     e.preventDefault();
                                                    //     handleFilterClearButton()
                                                    // }}
                                                >
                                                    Clear
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" class="export-btn" 
                                    // onClick={downloadPdf}
                                    >
                                        Export To XLS</Button>
                                </form>
                            </div>
                            <div class="table-wrap vendor-wrap" id="space-report">
                                <div class="inner-table" id="inner-purchase">
                                    {/* {Array.isArray(invoiceTable) && invoiceTable.length > 0 ? ( */}
                                        <table id="purcahse-tablewrap" class="table-hover">
                                            <thead>
                                                <tr id="header-row">
                                                    <th class="hedaings-tb">S. No</th>
                                                    <th class="hedaings-tb">PO No.</th>
                                                    <th class="hedaings-tb">PO Amount</th>
                                                    <th class="hedaings-tb">CO Approved Amt</th>
                                                    <th class="hedaings-tb">Invoice Received Month - Amt </th>
                                                    <th class="hedaings-tb">Total Invoice Amt </th>
                                                    <th class="hedaings-tb">Balance </th>
                                                    <th class="hedaings-tb">% Billed </th>
                                                </tr>
                                            </thead>
                                            {/* <tbody>
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
                                                    </tr>
                                                ))}
                                            </tbody> */}
                                        </table>
                                    {/* ) : (
                                        <p className="no-data-p">No data found.</p>
                                    )} */}
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubcontractorReport;