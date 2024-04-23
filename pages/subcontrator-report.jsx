import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import ReportHeader from "@/components/ReportHeader";
import { downloadSubcontractorReport, getSubcontractorReport } from "@/apis/apis/adminApis";
import Filters from "@/components/Filters";
import { saveAs } from "file-saver";
import { Button, Pagination } from "antd";
import withAuth from "@/components/PrivateRoute";
import Accordian from '@/components/accordian';
import { CloseOutlined } from "@ant-design/icons";

const SubcontractorReport = () => {
    const [poList, setPoList] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const getPos = () => {
        const queryString = new URLSearchParams({
            page: currentPage
        }).toString();
        const response = getSubcontractorReport(queryString);
        response.then((res) => {
            if (res?.status === 200) {
                setPoList([...res?.data?.results?.data]);
                setCount(res.data.count);
            }
        })
    }

    useEffect(() => {
        getPos();
    }, []);

    const downloadPdf = (data) => {
        const queryString = new URLSearchParams({
            ...data
        }).toString();
        const response = downloadSubcontractorReport(queryString);
        response.then((res) => {
            if (res.data) {
                const fileName = `subcontractor-report.xlsx`;
                saveAs(res.data, fileName);
            }
        })
    }

    const applyFilters = (data) => {
        if (typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({ ...data }).toString();
            const response = getSubcontractorReport(queryString);
            response.then((res) => {
                setPoList([...res?.data?.results?.data]);
                setCount(res.data.count);
            });
        } else {
            getPos();
        }
    }

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    return (
        <>

            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Subcontractor Report" />
                    <div class="bottom-wrapp">
                        <ReportHeader />
                        <div>
                            <button className="acc-btn" onClick={() => setIsOpen(!isOpen)}>Open PopUp</button>
                            {isOpen && (
                                <div className="popup">
                                    <div  className="acc-icon"><CloseOutlined/></div>
                                    <h5>This is a Popup</h5>
                                    <Accordian />
                                </div>
                            )}
                        </div>
                        <Filters fromDate={true} toDate={true} download={true} status={true} project_number={true} applyFilters={applyFilters} currentPage={currentPage} downloadPdf={downloadPdf} />
                        <div class="table-wrap vendor-wrap" id="space-report">
                            <div class="inner-table" id="inner-purchase">
                                <table id="purcahse-tablewrap" class="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th class="hedaings-tb">S. No</th>
                                            <th class="hedaings-tb">Project No.</th>
                                            <th class="hedaings-tb">PO No.</th>
                                            <th class="hedaings-tb">PO Amount</th>
                                            <th class="hedaings-tb">CO Approved Amt</th>
                                            <th class="hedaings-tb">Invoice Received Month</th>
                                            <th class="hedaings-tb">Invoice Received Amount </th>
                                            <th class="hedaings-tb">Total Contract Amt </th>
                                            <th class="hedaings-tb">Total Invoice Amt </th>
                                            <th class="hedaings-tb">Balance</th>
                                            <th class="hedaings-tb">Billed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poList.map((po, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{po.project_number}</td>
                                                    <td>{po.po_number}</td>
                                                    <td>{po.po_amount?.toLocaleString()}</td>
                                                    {/* <td>{po.COApprovedAmt ? po.COApprovedAmt.split('\n').join(' ,').toLocaleString() : '-'}</td>
                                                    <td>{po.InvoiceReceivedMonthAmt ? po.InvoiceReceivedMonthAmt.split('\n').join(' ,').toLocaleString() : '-'}</td> */}
                                                    <td>{po.COApprovedAmt ? po.COApprovedAmt.split('\n').map((amount) => parseFloat(amount).toLocaleString()).join(' ,') || '-' : '-'}</td>
                                                    <td>{po.InvoiceReceivedMonth ? po.InvoiceReceivedMonth.split('\n').join(' ,') || '-' : '-'}</td>
                                                    <td>{po.InvoiceReceivedAmount ? po.InvoiceReceivedAmount.split('\n').join(' ,') || '-' : '-'}</td>
                                                    <td>{po.total_contract_amt?.toLocaleString()}</td>
                                                    <td>{po.total_invoice_received_amount?.toLocaleString()}</td>
                                                    <td>{po.balance?.toLocaleString()}</td>
                                                    <td>{po.percent_billed}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
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
export default withAuth(['project manager', 'director', 'site superintendent', 'accounting', 'department manager', 'project coordinator', 'marketing', 'health & safety', 'estimator', 'shop', 'admin'])(SubcontractorReport)

// export default SubcontractorReport;