import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
import Link from "next/link";

const PO_list = ({ base_url }) => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [totalPuchaseOrder, setTotalPurchaseOrder] = useState(0);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                };
                const response = await axios.get(`${base_url}/api/admin/purchase-order`, { headers });
                setTotalPurchaseOrder(response.data.total_purchase_orders);
                setPurchaseOrders(response.data.purchase_orders || []); // Ensure purchase_orders is an array
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchRoles();
    }, []);

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
                                <span className="text-size mt-0 mb-2">{totalPuchaseOrder}</span>
                                <span>Total POs</span>
                            </li>
                        </ul>
                        <div className="wrapin-form">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Users" />
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
                                        {Array.isArray(purchaseOrders) && purchaseOrders.length > 0 ? (
                                            purchaseOrders.map((purchase, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{purchase.material?.po?.po_number}</td>
                                                    <td className="td-color">{purchase.material?.po?.po_type}</td>
                                                    <td>{new Date(purchase.material?.po?.created_on).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</td>
                                                    <td>{purchase.material?.Total_amount}</td>
                                                    <td>{purchase.material?.po?.status}</td>
                                                    <td>{purchase.material?.po?.phone}</td>
                                                    <td className="td-icon-color">
                                                        <a href="#" className="me-1"><EyeFilled /></a>
                                                        <a href="" className="me-1"><DeleteFilled /></a>
                                                        <a href="" className="me-1"><EditFilled /></a>
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
