import React, { useEffect } from 'react'
import '../styles/style.css'
import { CloseOutlined } from "@ant-design/icons";

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function PoStatus({ setStatusModalOpen, data, isStatusModalOpen }) {
    const handleCloseModal = () => {
        setStatusModalOpen(false);
        document.querySelector(".wrapper-main").classList.remove("hide-bg-wrap");
    };

    useEffect(() => {
        if (isStatusModalOpen) {
            document.querySelector(".wrapper-main").classList.add("hide-bg-wrap");
        }
    }, [isStatusModalOpen]);

    return (
        <>
            <div className='po-status-main-view'>
                <div className='po-status'>
                    <div className="po-span" >
                        <CloseOutlined onClick={handleCloseModal} />
                    </div>
                    <h1>Status</h1>
                </div>
                {
                    data.map((data) => {
                        return <div className='po-status-p'>
                            <h5>{data.status?.charAt(0)?.toUpperCase() + data.status?.slice(1)} <span className="po-span">:- {formatDate(data.created_on)}</span></h5>
                            <h5>{data.status?.charAt(0)?.toUpperCase() + data.status?.slice(1)} By <span className="po-span">:- {data?.created_by?.first_name + ' ' + data?.created_by?.last_name}</span></h5>
                            {data.amount > 0 ? (
                                <h5 className='sub-show '>Approved Co Amount <span className="po-span">- {data.amount}</span> </h5>
                            ) : null}
                            <p className='text-note-wrapper'>
                                {data.notes || ' N/A'}
                            </p>
                        </div>
                    })
                }
            </div>
        </>
    )
}

export default PoStatus;