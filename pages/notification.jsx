import React, { useState } from "react";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import '../styles/style.css';

const Notification = () => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
        setIsActive(current => !current);
    };

    const [isActive, setIsActive] = useState(false);


    return (
        <div className="sidebar-wrapp scroll">
            <div className="inner-side">
                <div className="icon-cross">
                    <h4>Notifications</h4>
                    <CloseOutlined />
                </div>
                <div className="sidebar-main mb-3">
                    <div className="sidebar-right mb-2 ">
                        <div className="text-sm-span">
                            <div className="d-flex justify-content-between">
                                <p className="mb-0 text-start"><b>New task.</b><span className="min"> 10m</span></p>
                                <button onClick={toggleShowMore} id="myBtn"  className={isActive ? 'transition' : ''} ><DownOutlined /></button>
                            </div>
                            <p className="mb-0 text-start ">SMS notifications are text Lorem{showMore && <span className="hide-span"> Blanditiis aliquam facere obcaecati tempora</span>}</p>
                        </div>
                        {/* <div className="drop-down-icons">
                            <a href="#"></a>
                        </div> */}
                    </div>
                    <div className="sidebar-right">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification;
