import React from "react";
import '../styles/style.css';
import { EyeFilled, EditFilled } from '@ant-design/icons'
import { Button, Select, } from 'antd';
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { PlusOutlined } from '@ant-design/icons'


const { Option } = Select;
function Invoice() {
    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <div className="top-wrapp">
                        <div className="text-wrap">
                            <h5>Invoice</h5>
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
                                <span className="text-sizes mb-3">5</span>

                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <span>Pending Invoice</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mb-3">224</span>
                                <span>Total Invoice</span>
                            </li>
                        </ul>
                        <div className="searchbar-wrapper">
                            <div className="Purchase-form">
                                <form className="search-purchase">
                                    <input className="vendor-input" placeholder="Invoice" />
                                    <Button className="vendor-search-butt">Search</Button>
                                </form>
                                <div className="purchase-filter">
                                    <span className="filter-span">Filter :</span>
                                    <Select className="line-select me-2" placeholder="Type">
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>
                                    {/* -------------------------- */}

                                    <Select className="line-select me-2" placeholder="PO Vendor" >
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>
                                    <Select className="line-select" placeholder="PO Status" >
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>

                                    {/* <Button className="click-btn"><span>Type</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Vendor</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Status</span><i className="fa-solid fa-chevron-down"></i></Button> */}
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
                                                <EyeFilled />
                                                <EditFilled />
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
                                                <EyeFilled />
                                                <EditFilled />
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
                                                <EyeFilled />
                                                <EditFilled />
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
                                                <EyeFilled />
                                                <EditFilled />
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
                                                <EyeFilled />

                                                <EditFilled />

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
                                                <EyeFilled />
                                                <EditFilled />

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
                                                <EyeFilled />
                                                <EditFilled />
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
                                                <EyeFilled />
                                                <EditFilled />
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