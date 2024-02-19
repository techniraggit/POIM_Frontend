import React, { useEffect, useState } from "react";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import '../styles/style.css';
import Link from "next/link";
import { allRead, getNotification, toggleButton } from "@/apis/apis/adminApis";
import { Button } from "antd";

const Notification = ({ closeNotification}) => {
    const [showMore, setShowMore] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const toggleShowMore = (id) => {
        setShowMore(!showMore);
        if(isActive === id){
            setIsActive('');
        }
        else{
            setIsActive(id);
            toggleButton({
                id: id,
            })
        }
    };
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        const response = getNotification()
        response.then((res) => {
            if (res?.data?.status) {
                setNotificationData(res.data.data);

            }

        })
    }, [])

    const formatTime = (time) => {
        const currentTime = new Date();
        const notificationTime = new Date(time);
        const timeDiff = Math.abs(currentTime - notificationTime);
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) {
            return 'just now';
        } else if (hours > 0 && hours < 24) {
            return `${hours} hours ago`;
        } else if (days > 0 && days <= 5) {
            return `${days} days ago`;
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return notificationTime.toLocaleDateString(undefined, options);
        }
    };

    const handleMarkAllAsRead=()=>{
        allRead()
        .then(() => {
            setNotificationData(prevNotifications => prevNotifications.map(notification => ({
                ...notification,
                is_read: true
            })));
        })
        .catch(error => {
            console.error('Error marking all notifications as read:', error);
        });
       
    }

    return (
        <div className="sidebar-wrapp scroll">
            <div className="inner-side">
                <div className="icon-cross align-items-center">
                    <h4 className="mb-0">Notifications</h4>
                    <span className="d-block mark-read"><Button onClick={handleMarkAllAsRead}>Mark all as Read</Button></span>
                    
                    <div className="cross-icon" onClick={closeNotification}>
                        <CloseOutlined />
                    </div>
                </div>
                <h6></h6>
                {Array.isArray(notificationData) &&
                    notificationData.map((notification, index) =>
                    (
                        <div className={`sidebar-main mb-3 ${notification.is_read ? 'read' : 'unread'}`} key={index}>
                        {/* // <div className="sidebar-main mb-3" key={index}> */}
                            <div className="sidebar-right mb-2 ">
                                <div className="text-sm-span">

                                    <div className="d-flex justify-content-between">
                                        <p className="mb-0 text-start"><b>{notification.title}</b><span className="min">  {formatTime(notification.created)}</span></p>
                                        <button
                                            onClick={() => toggleShowMore(notification.id)}
                                            id="myBtn" className={isActive === notification.id ? 'transition' : ''} ><DownOutlined /></button>
                                    </div>
                                    {isActive === notification.id && <p className="mb-0 text-start ">{notification.message}
                                    </p>}
                                </div>

                            </div>
                            <div className="sidebar-right">
                            </div>
                        </div>
                    )
                    )}
            </div>
        </div>
    )
}

export default Notification;
