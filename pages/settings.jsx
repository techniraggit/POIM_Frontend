import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import '../styles/style.css'
import { Button, message } from "antd";
import { threshold, updateThreshold } from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Roles from "@/components/Roles";
import { useGlobalContext } from "@/app/Context/UserContext";


const Settings = () => {
    const [thresholdData, setThresholdData] = useState(0)
    const { user } = useGlobalContext();
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
                            {Array.isArray(thresholdData) && thresholdData.map((item, index) => (
                                <div className="col-lg-4 col-md-6 mb-md-3">
                                    <div className="wrapp-box">
                                        <div className="lists-items me-2 d-flex align-items-center">
                                            <span className="img-clr me-3">
                                                <img src="./images/to-do-list.svg" alt="" className="" />
                                            </span>
                                            <span style={{ textTransform: 'capitalize' }}>{item.name}</span>
                                        </div>
                                        <div className="lists-items me-2">
                                            <div className="card-thre-wrap d-flex align-items-center">
                                                <p className="mb-0 set-thre me-1">Set Threshold Limit</p><span>i</span>
                                            </div>
                                            <div className="dollars-input d-flex align-items-center">
                                                <span className="dollar-sign">$</span>
                                                <input placeholder="Enter value in dollars"
                                                    disabled={!user.permissions.includes('edit_threshold')}
                                                    value={`${thresholdData[index].value}`}
                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                />
                                            </div>
                                            <hr className="mt-4" />
                                            <Roles action='edit_threshold'>
                                                <Button className="save-Button" onClick={() => handleSaveClick(item.th_id, item.value)}>save</Button>
                                            </Roles>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;