import React from 'react';
import { Button  } from "antd";

import '../styles/style.css'

function SubcontractorPurchaseOrderForm() {
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
                        <i className="fa-solid fa-plus me-3 mt-0"></i>
                        <span>Create New Purchase Order</span>
                    </li>
                </ul>
                <div className="choose-potype">
                    <div className="inner-choose">
                        <form className="file-form">
                            <div className="row exist-row">
                                <div className="col-md-4">
                                    <div className="selectwrap">
                                        <label className="bold-label">Choose PO Type</label>
                                        <select id="sub1" className="js-states form-control file-wrap-select bold-select">
                                            <option>Subcontractor Po</option>
                                            <option>Non Project Related</option>
                                            <option>Combined</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="new-existing">
                                        <Button className="new-btn me-3">New</Button>
                                        <Button classNameName="exist-btn">Existing</Button>
                                    </div>
                                </div>
                            </div>
                            {/* <!--  --> */}
                            <div className="row space-raw ">
                                <div className="col-lg-4 ol-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Original PO Amount</label>
                                        <input type="number"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 ol-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Invoice Received Amount</label>
                                        <input type="number"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 ol-md-6"></div>
                                
                                </div>
                            {/* <!--  --> */}
                            <div className="row space-raw ">
                                <div className="col-lg-4 ol-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Purchase Order Number</label>
                                        <input type="number"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 ol-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Date</label>
                                        <input type="date"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 ol-md-6"></div>
                                
                                </div>
                            {/* <!--  --> */}
                            <div className="linewrap d-flex" id="w-small">
                                <span className="d-block me-0">To</span>
                                <hr/>
                            </div>
                            {/* <!--  --> */}
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="selectwrap">
                                        <label for="file" className="same-clr">Vendor</label>
                                        <select id="sub-vendor" className="js-states form-control file-wrap-select">
                                            <option></option>
                                            <option>Non Project Related</option>
                                            <option>Combined</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* <!--  --> */}
                            <div className="row space-raw ">
                                <div className="col-lg-4 ol-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Name</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 ol-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Email</label>
                                        <input type="email"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Contact Number</label>
                                        <input type="tel"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Address Line 1</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Address Line 2</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">State / Province</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Country</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                            </div>
                            {/* <!--  --> */}
                            <div className="linewrap d-flex">
                                <span className="d-block me-4">Details</span>
                                <hr/>
                            </div>
                            {/* <!--  --> */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="wrap-box">
                                        <label for="name">Scope Of Work</label>
                                        <textarea className="text-area" rows="4" cols="50"></textarea>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="wrap-box">
                                        <label for="name">Date</label>
                                        <input type="date"/>
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="wrap-box">
                                        <label for="name">Amount</label>
                                        <input type="text"/>
                                    </div>
                                </div>

                            </div>
                            {/* <!--  --> */}
                            <div className="linewrap d-flex mt-3">
                                <span className="d-block me-3">For Project</span>
                                <hr/>
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
                                    <div className="selectwrap">
                                        <label for="file" className="same-clr">Project Number</label>
                                        <select id="sub2" className="js-states form-control file-wrap-select">
                                            <option></option>
                                            <option>123 456</option>
                                            <option>Combined</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Project Name</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="wrap-box">
                                        <label for="name">Address</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                            </div>
                            {/* <!--  --> */}
                            <div className="linewrap d-flex">
                                <span className="d-block me-2">By Details</span>
                                <hr/>
                            </div>
                            {/* <!--  --> */}
                            <div className="row">
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">First Name</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Last Name</label>
                                        <input type="text"/>
                                    </div>
                                </div>
                            </div>
                            {/* <!--  --> */}
                            <div className="row">
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">HST Amount</label>
                                        <input type="number"/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="wrap-box">
                                        <label for="name">Total Amount</label>
                                        <input type="number"/>
                                    </div>
                                </div>
                            </div>
                             {/* <!--  --> */}
                             <div className="sub-line d-flex">
                                <span className="d-block me-2">Additional Notes</span>
                                <hr/>
                            </div>
                            <div className="current-div">
                                <div className="top-first">
                                    <p>Submit The Following Items To Ap@Duron.Ca & The Project Team Before Work Commences :</p>
                                 <div className="inner-para">
                                    <p>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.</p>
                                    <p>Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat.</p>
                                    <p> Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident.</p>
                                    <p> Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.</p>
                                 </div>
                                </div>
                                <div className="top-first bottom-second">
                                    <p>Terms & Conditions</p>
                                 <div className="inner-para">
                                    <p>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.</p>
                                    <p>Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat.</p>
                                    <p> Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident.</p>
                                    <p> Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.</p>
                                 </div>
                                </div>

                            </div>
                            {/* <!-- btn --> */}
                            <div className="po-wrap">
                                <Button className="create-ven-butt">Create PO</Button>
                            </div>

                        </form>
                    </div>

                    {/* <!--  --> */}
                </div>
            </div>
        </div>
    </div>

        </>
    )
}

export default SubcontractorPurchaseOrderForm;