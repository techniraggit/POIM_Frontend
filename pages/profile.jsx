import React from 'react'
import Sidebar from "@/components/sidebar";
import Header from '@/components/header';

function profile() {
    return (
       
        <div>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                <Header heading="Vendor" />
                    <div className="bottom-wrapp">
                    <ul className=" create-icons">
                            <li className="me-0 icon-text">
                                <i className="fa-solid fa-plus me-3 mt-0"></i>
                                <span>Create New Vendor</span>
                            </li>
                        </ul>
                        <div className="vendor-form">
                            <div className="row first-section ">

                                <div className="col-lg-4 col-md-12 ">
                                    <div className="user-image">
                                        <img src="./images/avtar.png" />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-12 ">
                                    <div className="vender-input">
                                        <label for="">First Name</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Last Name</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Email</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Pnone No</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Address</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">State / Province</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Country</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-12">
                                    <div className="save-main">
                                        <buttton className="save-changes-butt">Save Changes</buttton>
                                    </div>
                                </div>
                            </div>
                            <hr/>

                            <div className="row top-border">
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Old Password</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for=""> New Password</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="vender-input">
                                        <label for="">Confirm New Password</label>
                                        <input type="text" name="" id=""/>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12">
                                    <div className="save-main">
                                        <buttton className="save-changes-butt">Save Changes</buttton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    
  )
}

export default profile