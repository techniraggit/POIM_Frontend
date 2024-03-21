import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { message, Popconfirm , Pagination, Button} from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import Link from "next/link";
import View_Vendor from "@/components/view-vendor";
import { getVendorList, vendorSearch } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";
import Filters from "@/components/Filters";

const Vendor = ({ base_url }) => {
    const [vendors, setVendors] = useState([]);
    const [totalVendor, setTotalVendor] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewVendorVisible, setViewVendorVisible] = useState(false);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')

    const getVendors = () => {
        const response = getVendorList(currentPage);
        response.then((res) => {
            if(res.status === 200) {
                setCount(res.data.count)
                setTotalVendor(res.data.results.total_vendors)
                setVendors(res.data.results.vendors);
            }
        })
    }

    useEffect(() => {
        getVendors()
    }, [])

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            const body = JSON.stringify({ vendor_id: id });

            const response = await axios.delete(`${base_url}/api/admin/vendors`, {
                headers,
                data: body,
            });

            message.success('vendor deleted successfully.');
            setTotalVendor(prevTotalVendor => prevTotalVendor - 1);
            setVendors(prevVendors => prevVendors.filter(vendor => vendor.vendor_id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete the item. Please try again later.');
        }
    };

    const handleIconClick = (id, index) => {
        setViewVendorVisible((prevVisible) => (prevVisible === id ? null : id));
        setIsModalOpen(true);
        setClickedIndex(index);
    };

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    const applyFilters = (data) => {
        if(typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({ ...data }).toString();
            const response = vendorSearch(queryString);
            response.then((res) => {
                setVendors(res.data.results.search_vendors_data)
            })
        } else {
            getVendors();
        }
    }

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Vendors" />
                    <div className="bottom-wrapp users-list-wrapin">
                        <ul className="list-icons mb-4">
                            <Roles action='add_vendor'>
                                <li className="me-4">
                                    <Link href="/create-vendor" className="mb-2 d-block"><PlusOutlined /></Link>
                                    <span>Create New Vendor</span>
                                </li>
                            </Roles>
                            <li className="me-4">
                                <span className="text-size mt-0">{totalVendor}</span>
                                <span>Total Vendors</span>
                            </li>
                        </ul>
                        <Filters search={true} applyFilters={applyFilters} currentPage={currentPage} />
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="vendor-table" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">Company Name</th>
                                            <th className="hedaings-tb">Vendor Name</th>
                                            <th className="hedaings-tb">Country</th>
                                            <th className="hedaings-tb">Status</th>
                                            <th className="hedaings-tb">State</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(vendors) && vendors.length > 0 ?(
                                            vendors.map((vendor, index) =>
                                            (
                                                <tr key={index} className={vendor.is_deleted ? 'light-blue' : ''}>
                                                  <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{vendor.company_name}</td>
                                                    <td>{vendor.vendor_contact[0].name}</td>
                                                    <td>{vendor.country}</td>
                                                    <td style={{textTransform:'capitalize'}}>{vendor.status}</td>
                                                    <td>{vendor.state}</td>
                                                    
                                                    <td className="td-icon-color">
                                                    {!vendor.is_deleted &&<Roles action='view_vendor'>
                                                            <EyeFilled onClick={() => handleIconClick(vendor.vendor_id, index)} />
                                                        </Roles>}
                                                        {!vendor.is_deleted &&<Roles action='delete_vendor'>
                                                            <Popconfirm
                                                                title="Are you sure you want to delete this item?"
                                                                onConfirm={() => handleDelete(vendor.vendor_id)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <DeleteFilled />
                                                            </Popconfirm>
                                                        </Roles>}
                                                        {!vendor.is_deleted &&<Roles action='edit_vendor'>
                                                        <Link href={`/edit_vendor/${vendor.vendor_id}`} className="me-2"><EditFilled /></Link>
                                                        </Roles>}
                                                    </td>
                                                </tr>
                                            )
                                            )):(
                                                <tr>
                                                <td colSpan="8">No Vendor available</td>
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
                                pageSize={10} // Number of items per page

                            />
                        </div>
                    </div>
                </div>
                {isModalOpen && <View_Vendor setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} vendor_id={isViewVendorVisible}
                    clickedIndex={clickedIndex}
                />}
            </div>
        </>
    )
}
export { getServerSideProps }
export default withAuth(['admin', 'accounting', 'project manager', 'department manager',
    'director', 'site superintendent', 'project coordinator', 'marketing', 'health & safety', 'estimator', 'shop'])
(Vendor)