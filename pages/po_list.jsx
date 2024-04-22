import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled, DownloadOutlined } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { message, Popconfirm, Pagination, Button } from 'antd';
import Link from "next/link";
import '../styles/style.css';
import { deletePO, downloadContract, filterSearchPo, getPoList } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";
import Filters from "@/components/Filters";
import { saveAs } from "file-saver";

const PO_list = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('');
    const [refetch, setRefetch] = useState(true);

    const getPos = () => {
        getPoList(currentPage).then((res) => {
            if (res?.data?.results?.status) {
                setPurchaseOrders(res.data.results.data || []);
                setCount(res.data.count)
            }
            setRefetch(false);
        })
    }

    useEffect(() => {
        if(refetch) {
            getPos();
        }
    }, [refetch]);

    const applyFilters = (data) => {
        if(typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({ ...data }).toString();
            const response = filterSearchPo(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setPurchaseOrders(res.data.results.data);
                setPurchaseOrders(res.data.results.search_query_data)
            })
        } else {
            getPos();
        }
    }

    const handleDelete = (id) => {
        const response = deletePO({ po_id: id });
        response.then((res) => {
            if (res?.data?.status) {
                message.success('Purchase Order deleted successfully.');
                setPurchaseOrders(prepo => prepo.filter(po => po.po_id !== id));
                setRefetch(true);
            }
        })
    };

    const rows = purchaseOrders || [];

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    const handleDownload = (id, name, contract_id) => {
        const response = downloadContract({
            id,
            contract_id
        });
        response.then((res) => {
            if(res.data) {
                saveAs(res.data, name);
            }
        })
    }

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Purchase Order" />

                    <div className="bottom-wrapp users-list-wrapin">
                        <ul className="list-icons mb-4">
                            <Roles action='add_purchase_order'>
                                <li className="me-4">
                                    <Link href="/create-material-po" className="d-block mb-2"><PlusOutlined /></Link>
                                    <span>Create PO</span>
                                </li>
                            </Roles>

                            <li className="me-4">
                                <span className="text-size mt-0 mb-2">{count || 0}</span>
                                <span>Total POs</span>
                            </li>
                        </ul>

                        <Filters applyFilters={applyFilters} currentPage={currentPage} search={true} type={true} vendor={true} status={true} />

                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="po-table" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">PO No.</th>
                                            <th className="hedaings-tb">Project Number</th>
                                            <th className="hedaings-tb">Purchase Order Type</th>
                                            <th className="hedaings-tb">PO Date</th>
                                            <th className="hedaings-tb">PO Amount</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th className="hedaings-tb">PO Vendor</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(rows) && rows.length > 0 ? (
                                            rows.map((purchase, index) => {
                                                // const rowClassName = purchase.is_deleted === 'false' ? 'light-blue' : '';
                                                return <tr key={index} className={purchase.is_deleted ? 'light-blue':''}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{purchase.po_number}</td>
                                                    <td>{purchase.project?.project_no || '-'}</td>
                                                    <td className="td-color">{purchase.po_type}</td>
                                                    <td>{new Date(purchase.po_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</td>
                                                    <td>{(purchase.total_amount).toLocaleString()}</td>
                                                    <td>{purchase.status}</td>
                                                    <td>{purchase.vendor_contact?.name}</td>
                                                    <td className="td-icon-color" >
                                                        <Roles action='view_purchase_order'>
                                                            {purchase.po_type === 'material' && (
                                                                <Link href={`/view-po/${purchase.po_id}`} className="me-1"><EyeFilled /></Link>
                                                            )}
                                                            {purchase.po_type === 'rental' && (
                                                                <Link href={`/view_rental_po/${purchase.po_id}`}><EyeFilled /></Link>
                                                            )}
                                                            {purchase.po_type === "subcontractor" && (
                                                                <Link href={`/view_subcontractor_po/${purchase.po_id}`} className="me-1"><EyeFilled /></Link>
                                                            )}
                                                        </Roles>

                                                        {!(purchase.is_deleted || purchase.status === 'approved') &&<Roles action='delete_purchase_order'>
                                                            <Popconfirm
                                                                title="Are you sure you want to delete this item?"
                                                                onConfirm={() => handleDelete(purchase.po_id)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <DeleteFilled />
                                                            </Popconfirm>
                                                        </Roles>}
                                                        {!purchase.is_deleted &&<Roles action='edit_purchase_order'>
                                                            {purchase.po_type === "material" && (
                                                                <Link href={`/edit_purchaseorder/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                            )}
                                                            {purchase.po_type === "rental" && (
                                                                <Link href={`/edit_rental_po/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                            )}
                                                            {purchase.po_type === "subcontractor" && (
                                                                <Link href={`/edit_subcontractor_po/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                            )}
                                                        </Roles>}
                                                        {purchase.po_type === 'subcontractor' && purchase.signed_contract?.length > 0 && <DownloadOutlined onClick={() => handleDownload(purchase.po_id, purchase.signed_contract[0].contract_file?.split('/')[purchase.signed_contract[0].contract_file?.split('/').length - 1], purchase.signed_contract[0].contract_id)} />}
                                                    </td>
                                                </tr>
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="8">No purchase orders available</td>
                                            </tr>
                                        )}
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
                                pageSize={10}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { getServerSideProps };
export default withAuth(['project manager', 'director', 'site superintendent', 'accounting', 'department manager', 'project coordinator', 'marketing', 'health & safety', 'estimator', 'shop', 'admin'])(PO_list)
