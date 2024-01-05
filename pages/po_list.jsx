import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { message, Popconfirm } from 'antd';
import Link from "next/link";
import { deletePO, getPoList } from "@/apis/apis/adminApis";

const PO_list = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const response = getPoList();
        response.then((res) => {
            if(res?.data?.status) {
                setPurchaseOrders(res.data.data || []);
            }
        })
    }, []);

    const handleDelete = (id) => {
        const response = deletePO({ po_id: id });
        response.then((res) => {
            if(res?.data?.status) {
                message.success('Purchase Order deleted successfully.');
                setPurchaseOrders(prepo => prepo.filter(po => po.po_id !== id));
            }
        })
    };

    const rows = purchaseOrders?.filter((order) => {
        return order.po_type.toLowerCase().includes(search.toLowerCase()) || 
            order.vendor_contact.name.toLowerCase().includes(search.toLowerCase())
    }) || [];

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Purchase Order" />

                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <li className="me-4">
                                <Link href="/create_po" className="d-block mb-2"><PlusOutlined /></Link>
                                <span>Create PO</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mt-0 mb-2">{purchaseOrders?.length || 0}</span>
                                <span>Total POs</span>
                            </li>
                        </ul>
                        <div className="wrapin-form">
                            <form className="search-vendor">
                                <input value={search} onChange={({ target: { value } }) => {
                                    setSearch(value);
                                }} className="vendor-input" placeholder="Search Purchase Order" />
                                <button className="vendor-search-butt">Search</button>
                            </form>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="resizeMe" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">PO No.</th>
                                            <th className="hedaings-tb">Purchase Order Type</th>
                                            <th className="hedaings-tb">PO Creation date</th>
                                            <th className="hedaings-tb">PO Amount</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th className="hedaings-tb">PO Vendor</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(rows) && rows.length > 0 ? (
                                            rows.map((purchase, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{purchase.po_number}</td>
                                                    <td className="td-color">{purchase.po_type}</td>
                                                    <td>{new Date(purchase.created_on).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</td>
                                                    <td>{purchase.total_amount}</td>
                                                    <td>{purchase.status}</td>
                                                    <td>{purchase.vendor_contact.name}</td>
                                                    <td className="td-icon-color">
                                                        <Link href={`/view-purchaseorder/${purchase.po_id}`} className="me-1"><EyeFilled /></Link>
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this item?"
                                                            onConfirm={() => handleDelete(purchase.po_id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <DeleteFilled />
                                                        </Popconfirm>
                                                        <Link href={`/edit_purchaseorder/${purchase.po_id}`} className="me-1"><EditFilled /></Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8">No purchase orders available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { getServerSideProps };
export default PO_list;
