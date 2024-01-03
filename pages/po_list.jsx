import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { Table, Button, message, Popconfirm, Input } from 'antd';
import axios from 'axios';
import Link from "next/link";

const PO_list = ({ base_url }) => {
    // const [po, setPo] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [totalPuchaseOrder, setTotalPurchaseOrder] = useState(0);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                };
                const response = await axios.get(`${base_url}/api/admin/purchase-order`, { headers });
                console.log(response.data.total_po,'purchase order listing');
                setPurchaseOrders(response.data.data || []);
                setTotalPurchaseOrder(response.data.total_po);
                // setPurchaseOrders(response.data.purchase_orders || []); // Ensure purchase_orders is an array
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchRoles();
    }, []);

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json', // Set content type to JSON
            };

            const body = JSON.stringify({ po_id: id }); // Use 'category_id' in the request body

            // console.log('Deleting category with ID:', );
            console.log('Request Headers:', headers);
            console.log('Request Body:', body);

            const response = await axios.delete(`${base_url}/api/admin/purchase-order`, {
                headers,
                data: body, // Send the body as data
            });

            console.log('Delete response:', response);
            message.success('Purchase Order deleted successfully.');
            setPurchaseOrders(prepo => prepo.filter(po => po.id !== id));
            // Reload the categories after deleting
        } catch (error) {
            console.error('Error deleting purchase order:', error);
            message.error('Failed to delete the item. Please try again later.');
        }
    };

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
                                <input className="vendor-input" placeholder="Search Purchase Order" />
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
                                                        <Link  href={`/view-purchaseorder/${purchase.id}`} className="me-1"><EyeFilled /></Link>
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this item?"
                                                            onConfirm={() => handleDelete(purchase.id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <DeleteFilled />
                                                        </Popconfirm>
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
