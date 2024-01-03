import React from "react";
import '../styles/style.css';
import { Button } from "antd";
function Invoice() {
    return (
        <>
            <div className="wrapper-main">
                <div className="aside-dashboard">
                    <div className="logo">
                        <a href="#"><img src="./images/logo.png" alt="" /></a>
                    </div>
                    <ul className="list-dboard">
                        <li>
                            <a href="#"><span className="db-span"><i className="fa-solid fa-house arrow-clr me-4"></i>Dashboard</span><i
                                className="fa-solid fa-chevron-left"></i></a>
                        </li>

                        <li>
                            <a href="#"><span className="db-span"><img src="./images/user.svg" alt="" className="me-4" />Users</span><i
                                className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/vendors.svg" alt="" className="me-4" />Vendors</span><i
                                className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Projects.svg" alt="" className="me-4" />Projects</span><i
                                className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Purchase.svg" alt="" className="me-4" />Purchase
                                Orders</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Invoice.svg" alt="" className="me-4" />Invoice</span><i
                                className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Reports.svg" alt="" className="me-4" />Reports</span><i
                                className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Settings.svg" alt="" className="me-4" />Settings</span><i
                                className="fa-solid fa-chevron-right"></i></a>
                        </li>
                    </ul>
                </div>
                <div className="inner-wrapper">
                    <div className="top-wrapp">
                        <div className="text-wrap">
                            <h5>Purchase Orders</h5>
                        </div>
                        <div className="notify">
                            <div className="leftwrap">
                                <img src="./images/notification.svg" alt="" />
                                <span>1</span>
                            </div>
                            <div className="user">
                                <span>John Smith</span><img src="./images/profile.png" alt="" className="ms-2" />
                            </div>
                        </div>
                    </div>
                    <div className="bottom-wrapp-purchase">
                        <ul className="list-icons">
                            <li className="me-4">
                                <i className="fa-solid fa-plus mb-3"></i>
                                <span>Create PO</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mb-3">224</span>
                                <span>Create User</span>
                            </li>
                        </ul>
                        <div className="searchbar-wrapper">
                            <div className="Purchase-form">
                                <form className="search-purchase">
                                    <input className="vendor-input" placeholder="Search Vendor" />
                                    <Button className="vendor-search-butt">Search</Button>
                                </form>
                                <div className="purchase-filter">
                                    <span className="filter-span">Filter :</span>
                                    <Button className="click-btn"><span>Type</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Vendor</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Status</span><i className="fa-solid fa-chevron-down"></i></Button>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <h5>Purchase Orders</h5>
                            <div className="inner-table" id="inner-purchase">
                                <table id="" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S. No</th>
                                            <th className="hedaings-tb">Invoice No.</th>
                                            <th className="hedaings-tb">PO No.</th>
                                            <th className="hedaings-tb">Created By</th>
                                            <th className="hedaings-tb">PO Amount</th>
                                            <th className="hedaings-tb td-color">PO Vendor</th>
                                            <th className="hedaings-tb">PO Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Teri Dactyl</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Olive Yew</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Sam Billings</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>7</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>Rental</td>
                                            <td className="td-color">Sam Billings</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>8</td>
                                            <td>#45488</td>
                                            <td>#45488</td>
                                            <td>Darell</td>
                                            <td>$2400</td>
                                            <td className="td-color">Lynn O’leeum</td>
                                            <td>Approved</td>
                                            <td>
                                                <div className="icons-td"><i className="fa-solid fa-eye"></i>
                                                    <i className="fa-solid fa-pen"></i>
                                                </div>
                                            </td>
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

export default Invoice;