import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { getServerSideProps } from "@/components/mainVariable";
import { EyeFilled, DeleteFilled , EditFilled } from '@ant-design/icons'
import Link from "next/link";

const Vendor = ({ base_url }) => {
    const [vendors, setVendors] = useState([]);
    const [totalVendor,setTotalVendor]=useState(0)
    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/vendors`, { headers: headers });
                console.log(response.data.total_vendors, '55555555555555555555555555');
                setTotalVendor(response.data.total_vendors)
                setVendors(response.data.vendors); // Assuming the API response is an array of projects
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
                                                    {/* <td className="td-color">{vendor.name}</td> */}
                                                    {/* <td>
                                                        {vendor.vendor_contact.map((vendor_contact, index) => (
                                                            <td>{vendor_contact.name}<br /></td>
                                                        ))}
                                                    </td> */}
                                                    <td>{vendor.country}</td>
                                                    <td>{vendor.state}</td>

                                                    {/* <td>
                                                        {vendor.vendor_contact.map((vendor_contact, index) => (
                                                            <td>{vendor_contact.name}<br /></td>
                                                        ))}
                                                    </td> */}
                                                    <td className="td-icon-color">
                                                        <a href="#" className="me-2"><EyeFilled /></a>
                                                        <a href="" className="me-2"><DeleteFilled /></a>
                                                        <a href="" className="me-2"><EditFilled /></a>
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