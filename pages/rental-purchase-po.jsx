import React from 'react';
import '../styles/style.css'
import Link from "next/link";
import { Form, Select,Button } from "antd";

import { PlusOutlined } from '@ant-design/icons'

function PurchaseOrderForm() {
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
                            <a href="#"><span className="db-span"><img src="./images/vendors.svg" alt=""
                                className="me-4" />Vendors</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Projects.svg" alt=""
                                className="me-4" />Projects</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Purchase.svg" alt="" className="me-4" />Purchase
                                Orders</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Invoice.svg" alt=""
                                className="me-4" />Invoice</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Reports.svg" alt=""
                                className="me-4" />Reports</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                        <li>
                            <a href="#"><span className="db-span"><img src="./images/Settings.svg" alt=""
                                className="me-4" />Settings</span><i className="fa-solid fa-chevron-right"></i></a>
                        </li>
                    </ul>
                </div>
                <div className="inner-wrapper">
                    <div className="top-wrapp">
                        <div className="text-wrap">
                            <h5>Purchase Order</h5>
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
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="icon-text">
                                <Link href="#" className="mb-2 d-block me-3"><PlusOutlined /></Link>
                                <span>Create New Purchase Order</span>
                            </li>
                        </ul>
                        <div className="choose-potype">
                            <div className="inner-choose">
                                <Form className="file-form">
                                    {/* <div className="row">
                                <div className="col-md-4">
                                    <div className="selectwrap add-dropdown-wrap shipment-border aligned-text">
                                        <label className="bold-label">Choose PO Type</label>
                                        <select id="sub1" className="js-states form-control file-wrap-select bold-select">
                                            <option></option>
                                            <option>Subcontractor Po</option>
                                            <option>Non Project Related</option>
                                            <option>Combined</option>
                                        </select>
                                    </div>
                                </div>
                            </div> */}

                                    <div class="row vendor-rowgap">
                                        <div class="col-lg-4 col-md-6">
                                            <div class="selectwrap react-select" id="vendor-selector">
                                                <div class="selectwrap  shipment-caret select-site aligned-text">
                                                    <Form.Item
                                                        label="Choose PO Type"
                                                        name="vendor_id"
                                                        for="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,

                                                                message: "Please choose Vendor",

                                                            },

                                                        ]}
                                                    >
                                                        <Select
                                                            id="rental1"
                                                            className="js-states form-control file-wrap-select"
                                                            onChange={(value) => handleVendorChange(value)}
                                                        >
                                                            {/* {names.map((entry) => (
                                                                <Select.Option key={entry.vendorId} value={entry.vendorId}>
                                                                    {entry.contactName}
                                                                </Select.Option>
                                                            ))} */}
                                                        </Select>

                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="order-choose d-flex">
                                        <div className="left-wrap">
                                            {/* <!-- <span className="d-block mb-1">Purchase Order Number</span> --> */}
                                            <label for="">Purchase Order Number</label>
                                            <input type="text" placeholder="00854" />
                                            {/* <!-- <p className="mb-0">00854</p> --> */}
                                        </div>
                                        <div className="left-wrap" id="forspce">
                                            {/* <!-- <span className="d-block mb-1">Date</span>
                                    <p className="mb-0">18 Oct 2023</p> --> */}
                                            <label for="">Date</label>
                                            <input type="text" placeholder="18 Oct 2023" />
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="linewrap d-flex" id="w-small">
                                        <span className="d-block me-0">To</span>
                                        <hr />
                                    </div>
                                    {/* <!--  --> */}
                                    <div class="row vendor-rowgap">
                                        <div class="col-lg-4 col-md-6">
                                            <div class="selectwrap react-select" id="vendor-selector">
                                                <div class="selectwrap  shipment-caret select-site aligned-text">
                                                    <Form.Item
                                                        label="Vendor"
                                                        name="vendor_id"
                                                        for="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,

                                                                message: "Please choose Vendor",

                                                            },

                                                        ]}
                                                    >
                                                        <Select
                                                            id="rental1"
                                                            className="js-states form-control file-wrap-select"
                                                            onChange={(value) => handleVendorChange(value)}
                                                        >
                                                            {/* {names.map((entry) => (
                                                                <Select.Option key={entry.vendorId} value={entry.vendorId}>
                                                                    {entry.contactName}
                                                                </Select.Option>
                                                            ))} */}
                                                        </Select>

                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="row space-raw ">
                                        <div className="col-lg-4 ol-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Name</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 ol-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Email</label>
                                                <input type="email" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Contact Number</label>
                                                <input type="tel" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Address Line 1</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Address Line 2</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">State / Province</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Country</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="linewrap d-flex">
                                        <span className="d-block me-4">Details</span>
                                        <hr />
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="wrap-box">
                                                <label for="name">Description</label>
                                                <textarea className="text-area" rows="4" cols="50"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 d-flex align-items-center">
                                            <div className="wrap-box">
                                                <label for="name">Date Range</label>
                                                <input type="date" />
                                            </div>
                                            <div className="text-to"><p className='mb-2'>To</p></div>
                                        </div>

                                        <div className="col-sm-4">
                                            <div className="wrap-box">
                                                <label for="name">To</label>
                                                <input type="date" />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="wrap-box">
                                                <label for="name">Amount</label>
                                                <input type="number" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-12"> */}
                                        <Form.Item>
                                            <Button className="add-more-btnn" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                <span >Add More Item</span>
                                            </Button>
                                        </Form.Item>
                                    {/* </div> */}
                                    {/* <!--  --> */}
                                    <div className="row mt-4">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">HST Amount</label>
                                                <input type="number" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Total Amount</label>
                                                <input type="number" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="linewrap d-flex mt-3">
                                        <span className="d-block me-3">Ship To</span>
                                        <hr />
                                    </div>
                                    {/* <div className="col-lg-4 col-md-6"> */}
                                    <div class="row vendor-rowgap">
                                        <div class="col-lg-4 col-md-6">
                                            <div class="selectwrap react-select" id="vendor-selector">
                                                <div class="selectwrap  shipment-caret select-site aligned-text">
                                                    <Form.Item
                                                        label="Choose Project"
                                                        name="vendor_id"
                                                        for="file"
                                                        class="same-clr"
                                                        rules={[
                                                            {
                                                                required: true,

                                                                message: "Please choose Vendor",

                                                            },

                                                        ]}
                                                    >
                                                        <Select
                                                            id="rental1"
                                                            className="js-states form-control file-wrap-select"
                                                            onChange={(value) => handleVendorChange(value)}
                                                        >
                                                            {/* {names.map((entry) => (
                                                                <Select.Option key={entry.vendorId} value={entry.vendorId}>
                                                                    {entry.contactName}
                                                                </Select.Option>
                                                            ))} */}
                                                        </Select>

                                                    </Form.Item>
                                                </div>
                                            </div>
                                        {/* </div> */}
                                    </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="linewrap d-flex mt-3">
                                        <span className="d-block me-3">For Project</span>
                                        <hr />
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="row">
                                        {/* <!-- <div className="col-sm-4">
                                    <div className="wrap-box">
                                        <label for="name">Quantity</label>
                                        <input type="text">
                                    </div>
                                </div> --> */}
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Project Number</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Project Name</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12">
                                            <div className="wrap-box">
                                                <label for="name">Address</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="linewrap d-flex">
                                        <span className="d-block me-2">By Details</span>
                                        <hr />
                                    </div>
                                    {/* <!--  --> */}
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">First Name</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6">
                                            <div className="wrap-box">
                                                <label for="name">Last Name</label>
                                                <input type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- btn --> */}
                                    <div className="po-wrap">
                                        <button className="create-ven-butt">Create PO</button>
                                    </div>

                                </Form>
                            </div>

                            {/* <!--  --> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default PurchaseOrderForm;