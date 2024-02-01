import React, { useEffect, useState } from 'react';
import DynamicTitle from '@/components/dynamic-title.jsx';
import '../styles/style.css'
import { CheckOutlined } from '@ant-design/icons'
import Link from "next/link";
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { getPoList } from '@/apis/apis/adminApis';

const Dashboard = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    useEffect(() => {
        const response = getPoList();
        response.then((res) => {
            if (res?.data?.status) {
                setPurchaseOrders(res.data.data || []);
            }
        })
    }, []);

    return (
        <>
            <DynamicTitle title="Dashboard" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Dashboard" />
                    <div className="bottom-wrapp">
                        <ul className="list-icons board-list">
                            <li className="me-4 me-md-3">
                                <Link href="#">
                                <i className="fa-solid fa-check mb-3"></i></Link>
                            <span>Create User</span>

                        </li>
                        {/* <li>
                            <Link href="#"><CheckOutlined /></Link>
                            <span>Create User</span>
                        </li> */}
                        <li className="me-4 me-md-3">
                        <Link href="#"> <i className="fa-solid fa-check mb-3"></i></Link>
                            <span>Create Vendors</span>
                        </li>
                        <li className="me-4 me-md-3">
                        <Link href="#"><i className="fa-solid fa-check mb-3"></i></Link>
                            <span>Create Project</span>
                        </li>
                        <li>
                        <Link href="#"><i className="fa-solid fa-check mb-3"></i></Link>
                            <span>Create New Roles</span>
                        </li>
                    </ul>
                    <div className="table-wrap">
                        <h5>Purchase Orders</h5>
                        <div className="inner-table">
                            <table id="dash-board-table" className="table-hover">
                                <thead>
                                    <tr id="header-row">
                                        <th className="hedaings-tb">S No.</th>
                                        <th className="hedaings-tb">PO No.</th>
                                        <th className="hedaings-tb">Purchase Order Type</th>
                                        <th className="hedaings-tb">PO Creation date</th>
                                        <th className="hedaings-tb">PO Amount</th>
                                        <th className="hedaings-tb">PO Status</th>
                                        <th className="hedaings-tb">PO Vendor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(purchaseOrders) && purchaseOrders.length > 0 ? (
                                        purchaseOrders.map((purchase, index) => (
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
                                                <td>{purchase.vendor_contact?.name}</td>
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
        </div >
        </>
    )
}
export default Dashboard;