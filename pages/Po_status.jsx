import React from 'react'
import '../styles/style.css'
import { CloseOutlined } from "@ant-design/icons";



function Po_status({ isModalOpen, setIsModalOpen }) {
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (

        <>
            {/* {isModalOpen &&( */}
            <div className='po-status-main'>
                <div className='po-status'>
                    <div  className="po-span" >
                    <CloseOutlined />
                    </div>
                    <h1>PO Status</h1>
                

                </div>
                <div className='po-status-p'>
                <h5>Approved <span className="po-span">:- 12th feb 2024</span> </h5>
                <h5 className='sub-show sub-hide'>Approved Co Amount <span className="po-span">- $450</span> </h5>

                    <p>
                    Lorem, ipsum dolor Lorem ipsum dolor sit amet.
                    </p>
                </div>
                <div className='po-status-p'>
                <h5>Approved <span className="po-span">:- 13th feb 2024</span> </h5>
                <h5 className='sub-show sub-hide'>Approved Co Amount <span className="po-span">- $450</span> </h5>
                    <p>
                     Lorem ipsumn Lorem ipsumn Lorem, ipsum dolor.   
                    </p>
                </div>
            </div>
            {/* )} */}
        </>
    )
}

export default Po_status;