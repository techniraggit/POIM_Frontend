import React from "react";
import Sidebar from "@/components/sidebar";
import '../styles/style.css'
import { Button } from "antd";


function Settings() {
    return (
        <>

            <div className="wrapper-main">
                <div className="aside-dashboard">
                    <div className="logo">
                        <a href="#"><img src="./images/logo.png" alt="" /></a>
                    </div>
                    <Sidebar />
                </div>
                <div className="inner-wrapper">
                    <div className="top-wrapp">
                        <div className="text-wrap">
                            <h5>Settings</h5>
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
                    <div className="outer-div">
                        <div className="listclips">

                            <div className="wrapp-box">
                                <div className="lists-items me-2">
                                    <i className="fa-solid fa-clipboard-list clip-list me-3 mt-0 "></i>
                                    <span>Material PO</span>
                                </div>
                                <div className="lists-items me-2">
                                    <div className="card-wrapp d-flex align-items-center">
                                        <p className="mb-0">Set Threshold Limit</p><span>i</span>
                                    </div>
                                    <div className="dollars-input">
                                        <input placeholder="Enter value in dollars" /><Button className="set-btn">Set</Button>
                                    </div>
                                    <hr className="mt-4" />
                                    <Button className="save-Button">save</Button>
                                </div>
                            </div>

                            <div className="wrapp-box">
                                <div className="lists-items me-2">
                                    <i className="fa-solid fa-clipboard-list clip-list me-3 mt-0 "></i>
                                    <span>Material PO</span>
                                </div>
                                <div className="lists-items me-2">
                                    <div className="card-wrapp d-flex align-items-center">
                                        <p className="mb-0">Set Threshold Limit</p><span>i</span>
                                    </div>
                                    <div className="dollars-input">
                                        <input placeholder="Enter value in dollars" /><Button className="set-btn">Set</Button>
                                    </div>
                                    <hr className="mt-4" />
                                    <Button className="save-Button">save</Button>
                                </div>
                            </div>

                            <div className="wrapp-box">
                                <div className="lists-items me-2">
                                    <i className="fa-solid fa-clipboard-list clip-list me-3 mt-0 "></i>
                                    <span>Material PO</span>
                                </div>
                                <div className="lists-items me-2">
                                    <div className="card-wrapp d-flex align-items-center">
                                        <p className="mb-0">Set Threshold Limit</p><span>i</span>
                                    </div>
                                    <div className="dollars-input">
                                        <input placeholder="Enter value in dollars" /><Button className="set-btn">Set</Button>
                                    </div>
                                    <hr className="mt-4" />
                                    <Button className="save-Button">save</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;