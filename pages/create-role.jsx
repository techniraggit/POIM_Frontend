import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons'

import { Button, message } from "antd";
import { threshold, updateThreshold } from "@/apis/apis/adminApis";
import Header from "@/components/header";



const Create_role = () => {
    const [thresholdData, setThresholdData] = useState(0)
    useEffect(() => {
        const response = threshold();
        response.then((res) => {
            setThresholdData(res.data.data || []);
        });
    }, [])
    const handleInputChange = (index, value) => {
        const updatedThresholdData = [...thresholdData];
        updatedThresholdData[index].value = value;
        setThresholdData(updatedThresholdData);
    };
    const handleSaveClick = (id, value) => {
        updateThreshold({
            th_id: id,
            value: value
        })
        .then((res) => {
            if (res.status) {
                message.success(res.data.message)
            }
        })
    }
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
                    <Header heading="Settings" />
                    <div className="outer-div">
                        <div className="listclips row">
                            {/* {Array.isArray(thresholdData) && thresholdData.map((item, index) => ( */}
                                <div className="col-lg-4 col-md-6 mb-md-3">
                                    <div className="wrapp-box">
                                        <div className="lists-items me-2 d-flex align-items-center">
                                            <span className="img-clr me-3">
                                            <PlusOutlined  className="setting-role-btn"/>
                                                {/* <img src="./images/to-do-list.svg" alt="" className="" /> */}
                                            </span>
                                            <span>Create New Role</span>
                                            {/* <span style={{ textTransform: 'capitalize' }}>{item.name}</span> */}
                                        </div>
                                        <div className="lists-items me-2">
                                            <div className="card-thre-wrap d-flex align-items-center">
                                                <p className="mb-0 set-thre me-1">Enter Role Title</p>
                                            </div>
                                            <div className="dollars-input d-flex align-items-center">
                                                {/* <span className="dollar-sign">$</span> */}
                                                <input
                                                    // value={`$${thresholdData[index].value}`}
                                                    // value={thresholdData[index].value}
                                                    //   value={`${thresholdData[index].value}`}
                                                    // onChange={(e) => handleInputChange(index, e.target.value)}
                                                />
                                            </div>
                                            {/* <hr className="mt-4" /> */}
                                            <Button className="save-Button" onClick={() => handleSaveClick(item.th_id, item.value)}>Add Role</Button>
                                        </div>
                                    </div>
                                </div>
                            {/* ))} */}
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create_role;