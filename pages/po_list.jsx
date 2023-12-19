import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
import Link from "next/link";
const PO_list = ({ base_url }) => {

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/purchase-order`, { headers: headers });
                console.log(response.data.purchase_orders, '55555555555555555555555555');
                setPurchaseOrders(response.data.purchase_orders); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [])


    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Purchase Order" />

                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <li className="me-4">
                                <Link href="/create_po"><PlusOutlined /></Link>
                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <span>Create PO</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mt-0">22</span>
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
                                            <th className="hedaings-tb">Purchase Orser Type</th>
                                            <th className="hedaings-tb">PO Creation date</th>
                                            <th className="hedaings-tb">PO Amount</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th className="hedaings-tb">PO Vendor</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Array.isArray(purchaseOrders) &&
                                            purchaseOrders.map((purchase, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{purchase.po_number}</td>
                                                    <td className="td-color">{purchase.po_type}</td>
                                                    <td>{purchase.created_on}</td>
                                                    <td>{purchase.status}</td>
                                                    <td>{purchase.status}</td>
                                                    <td>
                                                        {purchase.vendor_contact && Array.isArray(purchase.vendor_contact) ? (
                                                            purchase.vendor_contact.map((vendor_contact, index) => (
                                                                <td key={index}>{vendor_contact.name}<br /></td>
                                                            ))
                                                        ) : (
                                                            <td>No vendor contact</td>
                                                        )}
                                                    </td>
                                                    <td className="td-icon-color">
                                                        <a href="#"><EyeOutlined /></a>
                                                        <a href=""><DeleteOutlined /></a>
                                                        <a href=""><EditOutlined /></a>
                                                    </td>
                                                </tr>
                                            ))}
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export { getServerSideProps }
export default PO_list