import { filterSearchPo, getPoList, poReport } from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Pagination, Button, Select } from 'antd';
import ReportHeader from "@/components/ReportHeader";
import { saveAs } from "file-saver";
import Filters from "@/components/Filters";

const purchaseOrderReport = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [count, setCount] = useState('')

    const getPos = () => {
        getPoList(currentPage).then((res) => {
            if (res?.data?.results?.status) {
                setPurchaseOrders(res.data.results.data || []);
                setCount(res.data.count)
            }
        })
    }

    useEffect(() => {
        getPos();
    }, []);

    const rows = purchaseOrders || [];

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    const downloadPdf = (data) => {
        const queryString = new URLSearchParams({
            ...data
        }).toString();
        const response = poReport(queryString);
        response.then((res) => {
            if (res.data) {
                const fileName = `po-report.xlsx`;
                saveAs(res.data, fileName);
            }
        })
    }

    const applyFilters = (data) => {
        if(typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({ ...data }).toString();
            const response = filterSearchPo(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setPurchaseOrders(res.data.results.data);
                setPurchaseOrders(res.data.results.search_query_data)
            });
        } else {
            getPos();
        }
    }

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="PO Report" />
                    <div class="bottom-wrapp">
                        <ReportHeader />
                        <Filters fromDate={true} toDate={true} download={true} type={true} status={true} applyFilters={applyFilters} currentPage={currentPage} downloadPdf={downloadPdf} />
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
