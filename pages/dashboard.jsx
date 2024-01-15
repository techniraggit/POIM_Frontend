import React from 'react';
import DynamicTitle from '@/components/dynamic-title.jsx';
import '../styles/style.css'
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

const Dashboard = () => {
    return (
        <>
            <DynamicTitle title="Dashboard" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Dashboard"/>
                    {/* <div className="top-wrapp">
                        <div className="text-wrap">
                            <h5>Dashboard</h5>
                        </div>
                        <div className="notify">
                            <div className="leftwrap">
                                <img src="/images/notification.svg" alt="" />
                                <span>1</span>
                            </div>
                            <div className="user">
                                <span>John Smith</span>
                                <img src="/images/profile.png" alt="" className="ms-2" />
                            </div>
                        </div>
                    </div> */}
                    <div className="bottom-wrapp">
                        <ul className="list-icons board-list">
                            <li className="me-4 me-md-3">
                                <i className="fa-solid fa-check mb-3"></i>
                                <span>Create User</span>
                            </li>
                            <li className="me-4 me-md-3">
                                <i className="fa-solid fa-check mb-3"></i>
                                <span>Create Vendors</span>
                            </li>
                            <li className="me-4 me-md-3">
                                <i className="fa-solid fa-check mb-3"></i>
                                <span>Create Project</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-check mb-3"></i>
                                <span>Create New Roles</span>
                            </li>
                        </ul>
                        <div className="table-wrap">
                            <h5>Purchase Orders</h5>
                            <div className="inner-table">
                                <table id="resizeMe" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S. No</th>
                                            <th className="hedaings-tb">PO</th>
                                            <th className="hedaings-tb">PO Type</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th className="hedaings-tb">Created By</th>
                                            <th className="hedaings-tb">Creation Date</th>
                                            <th className="hedaings-tb">Invoice Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>#1226465</td>
                                            <td>Material PO</td>
                                            <td>Approved</td>
                                            <td>Sam</td>
                                            <td>02 Sep 23</td>
                                            <td>Approved</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>#1226465</td>
                                            <td>Rental PO</td>
                                            <td>Approved</td>
                                            <td>Smith</td>
                                            <td>02 Sep 23</td>
                                            <td>Approved</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>#1226465</td>
                                            <td>Subcontractor PO</td>
                                            <td>Closed</td>
                                            <td>Jason</td>
                                            <td>02 Sep 23</td>
                                            <td>Closed</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>#1226465</td>
                                            <td>Roberts</td>
                                            <td>Closed</td>
                                            <td>Jason</td>
                                            <td>02 Sep 23</td>
                                            <td>Closed</td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>#1226465</td>
                                            <td>Alsop</td>
                                            <td>Closed</td>
                                            <td>Approved</td>
                                            <td>02 Sep 23</td>
                                            <td>Approved</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>#1226465</td>
                                            <td>Forsyth</td>
                                            <td>Closed</td>
                                            <td>Jason</td>
                                            <td>02 Sep 23</td>
                                            <td>Closed</td>
                                        </tr>
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
export default Dashboard;




