import React from "react";
import '../styles/style.css'

const Header = ({heading}) => {
    return (
        <>
            <div className="top-wrapp">
                <div className="text-wrap">
                    <h5>{heading}</h5>
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
            </div>
        </>
    )
}
export default Header