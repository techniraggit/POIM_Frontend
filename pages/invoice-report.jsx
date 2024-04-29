import {
  invoiceList,
  filterSearch,
  invoiceReportPdf,
} from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Pagination, Button } from "antd";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import ReportHeader from "@/components/ReportHeader";
import Filters from "@/components/Filters";
import dayjs from "dayjs";

const invoiceReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState("");
  const [invoiceTable, setInvoiceTable] = useState([]);

  const getInvoices = () => {
    invoiceList(currentPage).then((res) => {
      if (res?.data?.results.status) {
        setInvoiceTable(res.data.results.data || []);
      }
      setCount(res.data.count);
    });
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const downloadPdf = (data) => {
    const queryString = new URLSearchParams({
      ...data,
    }).toString();
    const response = invoiceReportPdf(queryString);
    response.then((res) => {
      if (res.data) {
        const fileName = `invoice-report-${dayjs().format('DD-mm-YYYY')}.xlsx`;
        saveAs(res.data, fileName);
      }
    });
  };

  const calculateStartingSerialNumber = () => {
    return (currentPage - 1) * 10 + 1;
  };

  const applyFilters = (data) => {
    if (typeof data === "object" && Object.keys(data).length > 0) {
      const queryString = new URLSearchParams({ ...data }).toString();
      const response = filterSearch(queryString);
      response.then((res) => {
        setCount(res.data.count);
        setInvoiceTable(res.data.results.search_invoice_data);
      });
    } else {
      getInvoices();
    }
  };

  return (
    <>
      <div className="wrapper-main">
        <Sidebar />
        <div className="inner-wrapper">
          <Header heading="Invoice Report" />
          <div class="bottom-wrapp">
            <ReportHeader />
            <Filters
              fromDate={true}
              toDate={true}
              download={true}
              type={true}
              vendor={true}
              status={true}
              applyFilters={applyFilters}
              currentPage={currentPage}
              downloadPdf={downloadPdf}
            />
            <div class="table-wrap vendor-wrap" id="space-report">
              <div class="inner-table" id="inner-purchase">
                {Array.isArray(invoiceTable) && invoiceTable.length > 0 ? (
                  <table id="purcahse-tablewrap" class="table-hover">
                    <thead>
                      <tr id="header-row">
                        <th className="hedaings-tb">S. No</th>
                        <th className="hedaings-tb">PO No.</th>
                        <th className="hedaings-tb">Created By</th>
                        <th className="hedaings-tb">PO Date</th>
                        <th className="hedaings-tb">PO Amount</th>
                        <th className="hedaings-tb td-color">PO Vendor</th>
                        <th className="hedaings-tb">PO Status</th>
                        <th className="hedaings-tb">PM</th>
                        <th className="hedaings-tb">DM</th>
                        <th className="hedaings-tb">Po Creator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceTable.map((invoice, index) => (
                        <tr key={index}>
                          <td>{calculateStartingSerialNumber() + index}</td>
                          <td>{invoice.purchase_order.po_number}</td>
                          <td>
                            {invoice.purchase_order.created_by.first_name}{" "}
                            {invoice.purchase_order.created_by.last_name}
                          </td>
                          <td>{invoice.purchase_order.po_date}</td>
                          <td>
                            {invoice.purchase_order.total_amount.toLocaleString()}
                          </td>
                          <td>{invoice.purchase_order.vendor_contact.name}</td>
                          <td>{invoice.purchase_order.status}</td>
                          <td>{invoice.pm_approval_status}</td>
                          <td>{invoice.dm_approval_status}</td>
                          <td>{invoice.po_creator_approval_status}</td>
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
                    style={
                      currentPage === 1
                        ? { pointerEvents: "none", opacity: 0.5 }
                        : null
                    }
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                }
                nextIcon={
                  <Button
                    style={
                      currentPage === Math.ceil(count / 10)
                        ? { pointerEvents: "none", opacity: 0.5 }
                        : null
                    }
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
  );
};
export default invoiceReport;
