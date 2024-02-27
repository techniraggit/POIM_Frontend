import React from 'react'
import '../styles/style.css'
import { CloseOutlined } from "@ant-design/icons";

function invoiceStatus({ setIsModalOpen }) {
 
    return (
        <>
            <div className='po-status-main'>
                <div className='po-status '>
                    <div className="po-span" >
                        <CloseOutlined />
                    </div>
                    <h1>Invoice Status</h1>
                </div>
                <div className='po-status-p '>
                    <h5>Approved By -<span className="po-span">Creater</span></h5>
                    <h5 className='sub-show '>Invoice approval date -<span className="po-span"></span> </h5>
                    <h5>Status -<span className="po-span"></span> </h5>
                    <p>
                        Lorem, ipsum dolor Lorem ipsum dolor sit amet.
                    </p>
                </div>
                <div className='po-status-p '>
                    <h5>Approved By -<span className="po-span">PM</span> </h5>
                    <h5 className='sub-show '>Invoice approval date -<span className="po-span"></span> </h5>
                    <h5>Status -<span className="po-span"></span> </h5>
                    <p className="mb-0">
                        Lorem ipsumn Lorem ipsumn Lorem, ipsum dolor.   
                    </p>
                </div>
                <div className='po-status-p'>
                    <h5>Approved By -<span className="po-span">DM</span> </h5>
                    <h5 className='sub-show '>Invoice approval date -<span className="po-span"></span> </h5>
                    <h5>Status -<span className="po-span"></span> </h5>
                    <p className="mb-0">
                        Lorem ipsumn Lorem ipsumn Lorem, ipsum dolor.   
                    </p>
                </div>
            </div>
        </>
    )

    }
export default invoiceStatus;