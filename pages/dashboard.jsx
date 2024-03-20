import React, { useEffect, useState } from 'react';
import DynamicTitle from '@/components/dynamic-title.jsx';
import '../styles/style.css'
import { CheckOutlined } from '@ant-design/icons'
import Link from "next/link";
import { Pagination,Button } from 'antd';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { getPoList } from '@/apis/apis/adminApis';
import Roles from '@/components/Roles';

const Dashboard = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    // const [loa]
    useEffect(() => {
        // const response = getPoList();
        getPoList(currentPage).then((res) => {
            if (res?.data?.results.status) {
                setPurchaseOrders(res.data.results.data || []);
            }
            setCount(res.data.count)
        })
    }, [currentPage]);

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    return (
        <>
            <DynamicTitle title="Dashboard" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Dashboard" />
                    <div className="bottom-wrapp">
                        <ul className="list-icons board-list">
                            <Roles action='add_user'>
                            <li className="me-4 me-md-3">
                                <Link href="/add-user">
                                    <i className="fa-solid fa-check mb-3"></i></Link>
                                <span>Create User</span>
                            </li>
                            </Roles>
                            {/* <li>
                            <Link href="#"><CheckOutlined /></Link>
                            <span>Create User</span>
                        </li> */}
                        <Roles action='add_vendor'>
                            <li className="me-4 me-md-3">
                                <Link href="create-vendor"> <i className="fa-solid fa-check mb-3"></i></Link>
                                <span>Create Vendors</span>
                            </li>
                            </Roles>
                            <Roles action="add_project">
                            <li className="me-4 me-md-3">
                                <Link href="create-project"><i className="fa-solid fa-check mb-3"></i></Link>
                                <span>Create Project</span>
                            </li>
                            </Roles>
                            {/* <li>
                                <Link href="#"><i className="fa-solid fa-check mb-3"></i></Link>
                                <span>Create New Roles</span>
                            </li> */}
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
                                                <tr key={index} className={purchase.is_deleted ? 'light-blue':''}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{purchase.po_number}</td>
                                                    <td className="td-color">{purchase.po_type}</td>
                                                    <td>{new Date(purchase.created_on).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}</td>
                                                    <td>{(purchase.total_amount).toLocaleString()}</td>
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
            </div >
        </>
    )
}
export default Dashboard;