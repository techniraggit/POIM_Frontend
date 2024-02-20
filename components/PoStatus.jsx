import React from 'react'
import '../styles/style.css'
import { CloseOutlined } from "@ant-design/icons";


function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function PoStatus({ setStatusModalOpen, data }) {
    const handleCloseModal = () => {
        setStatusModalOpen(false);
    };


    return (
        <>
            <div className='po-status-main '>
                <div className='po-status'>
                    <div className="po-span" >
                        <CloseOutlined onClick={handleCloseModal} />
                    </div>
                    <h1>PO Status</h1>
                </div>
                    {
                        data.map((data) => {
                            return <div className='po-status-p'>
                                <h5>Approved <span className="po-span">:-{formatDate(data.created_on)}</span></h5>
                                {data.amount > 0 ? (
                                    <h5 className='sub-show '>Approved Co Amount <span className="po-span">-{data.amount}</span> </h5>
                                ) : null}
                                <p>
                                    {data.notes}
                                </p>
                            </div>
                        })
                    }
            </div>
        </>
    )
}

export default PoStatus;