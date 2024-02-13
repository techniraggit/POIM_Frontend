import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { message, Popconfirm,Pagination,Button } from 'antd';
import Link from "next/link";
import { deletePO, getPoList, poSearch } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";

const PO_list = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    
    useEffect(() => {
        // const response = getPoList();
        getPoList(currentPage).then((res) => {
            if (res?.data?.results?.status) {
               
                setPurchaseOrders(res.data.results.data || []);
            }
            setCount(res.data.count)
           
        })
    }, [currentPage]);

    const handleDelete = (id) => {
        const response = deletePO({ po_id: id });
        response.then((res) => {
            if (res?.data?.status) {
                message.success('Purchase Order deleted successfully.');
                setPurchaseOrders(prepo => prepo.filter(po => po.po_id !== id));
            }
        })
    };

    const rows = purchaseOrders?.filter((order) => {
        return order.po_type.toLowerCase().includes(search.toLowerCase()) ||
            order.vendor_contact.name.toLowerCase().includes(search.toLowerCase())
    }) || [];
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleButtonClick = async (event) => {
        event.preventDefault();
        poSearch(inputValue).then((response) => {
            setPurchaseOrders(response.data.search_query_data)

        })

    };
    const handleClearButtonClick = () => {
        setInputValue('');
        getPoList().then((res) => {
            setPurchaseOrders(res.data.data);
        })
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Purchase Order" />

                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <Roles action='add_purchase_order'>
                                <li className="me-4">
                                    <Link href="/create-material-po" className="d-block mb-2"><PlusOutlined /></Link>
                                    <span>Create PO</span>
                                </li>
                            </Roles>

                            <li className="me-4">
                                <span className="text-size mt-0 mb-2">{purchaseOrders?.length || 0}</span>
                                <span>Total POs</span>
                            </li>
                        </ul>
                        {/* <div className="wrapin-form"> */}
                        <div className="wrapin-form add-clear-wrap">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Vendor"
                                    value={inputValue} onChange={handleInputChange}
                                />
                                <button className="vendor-search-butt"
                                    onClick={handleButtonClick}
                                >Search</button>
                            </form>
                            <button type="submit" className="clear-button ms-3" onClick={handleClearButtonClick}>Clear</button>
                            {/* <form className="search-vendor">
                                <input value={search} onChange={({ target: { value } }) => {
                                    setSearch(value);
                                }} className="vendor-input" placeholder="Search Purchase Order" />
                                <button className="vendor-search-butt">Search</button>
                            </form> */}
                        </div>
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
                                                return <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{purchase.po_number}</td>
                                                    <td>{purchase.project?.project_no || '-'}</td>
                                                    <td className="td-color">{purchase.po_type}</td>
                                                    <td>{new Date(purchase.po_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</td>
                                                    <td>{purchase.total_amount}</td>
                                                    <td>{purchase.status}</td>
                                                    <td>{purchase.vendor_contact?.name}</td>
                                                    <td className="td-icon-color">
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

                                                        <Roles action='delete_purchase_order'>
                                                            <Popconfirm
                                                                title="Are you sure you want to delete this item?"
                                                                onConfirm={() => handleDelete(purchase.po_id)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <DeleteFilled />
                                                            </Popconfirm>
                                                        </Roles>
                                                        <Roles action='edit_purchase_order'>
                                                            {purchase.po_type === "material" && (
                                                                <Link href={`/edit_purchaseorder/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                            )}
                                                            {purchase.po_type === "rental" && (
                                                                <Link href={`/edit_rental_po/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                            )}
                                                            {purchase.po_type === "subcontractor" && (
                                                                <Link href={`/edit_subcontractor_po/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                            )}
                                                        </Roles>
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
                            // defaultCurrent={2}
                            current={currentPage}
                            onChange={setCurrentPage}
                            showSizeChanger={true}
                            prevIcon={<Button>Previous</Button>}
                            nextIcon={<Button>Next</Button>}
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

export { getServerSideProps };
export default withAuth(['project manager', 'site superintendent', 'accounting', 'department manager', 'project coordinator', 'marketing', 'health & safety', 'estimator', 'shop', 'admin'])(PO_list)

// export default PO_list;
