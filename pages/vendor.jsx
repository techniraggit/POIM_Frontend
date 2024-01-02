import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { Table, Button, message, Popconfirm, Input } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import Link from "next/link";
import View_Vendor from "@/components/view-vendor";

const Vendor = ({ base_url }) => {
    const [vendors, setVendors] = useState([]);
    const [totalVendor, setTotalVendor] = useState(0)
    const [isViewVendorVisible, setViewVendorVisible] = useState(false);



    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/vendors`, { headers: headers });
                console.log(response.data, '55555555555555555555555555');
                setTotalVendor(response.data.total_vendors)
                setVendors(response.data.vendors); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [])


    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json', // Set content type to JSON
            };

            const body = JSON.stringify({ vendor_id: id }); // Use 'category_id' in the request body

            // console.log('Deleting category with ID:', );
            console.log('Request Headers:', headers);
            console.log('Request Body:', body);

            const response = await axios.delete(`${base_url}/api/admin/vendors`, {
                headers,
                data: body, // Send the body as data
            });

            console.log('Delete response:', response);
            message.success('vendor deleted successfully.');
            setVendors(prevVendors => prevVendors.filter(vendor => vendor.vendor_id !== id));
            // Reload the categories after deleting
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete the item. Please try again later.');
        }
    };


    const handleIconClick = (id) => {
        setViewVendorVisible((prevVisible) => (prevVisible === id ? null : id));
    };
    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Vendors" />
                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <li className="me-4">
                                <Link href="/create-vendor" className="mb-2 d-block"><PlusOutlined /></Link>
                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <div>Create New Vendor</div>
                            </li>
                            <li className="me-4">
                                <span className="text-size mt-0">{totalVendor}</span>
                                <span>Total Vendors</span>
                            </li>
                        </ul>
                        <div className="wrapin-form">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Vendor" />
                                <button className="vendor-search-butt">Search</button>
                            </form>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="resizeMe" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">Company Name</th>
                                            <th className="hedaings-tb">Country</th>
                                            <th className="hedaings-tb">State</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(vendors) &&
                                            vendors.map((vendor, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{vendor.company_name}</td>

                                                    <td>{vendor.country}</td>
                                                    <td>{vendor.state}</td>
                                                    <td className="td-icon-color">
                                                        {/* <Link href="#" className="me-2"> */}
                                                        <EyeFilled onClick={() => handleIconClick(vendor.id)} />
                                                        {isViewVendorVisible === vendor.id && <View_Vendor vendor_id={vendor.vendor_id} />}


                                                        {/* </Link> */}
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this item?"
                                                            onConfirm={() => handleDelete(vendor.vendor_id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <DeleteFilled />
                                                        </Popconfirm>
                                                        <Link href={`/edit_vendor/${vendor.vendor_id}`} className="me-2"><EditFilled /></Link>
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
export default Vendor