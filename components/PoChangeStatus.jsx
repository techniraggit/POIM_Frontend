import React, { useEffect, useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';
import { useGlobalContext } from "@/app/Context/UserContext";

const ChangeStatus = ({ isModalOpen, setIsModalOpen, handleStatusChange, poType }) => {
  const { user } = useGlobalContext();
  const handleCloseModal = () => {
    setIsModalOpen({
      modalStatus: false,
      action: ''
    });
    document.querySelector(".wrapper-main").classList.remove("hide-bg-wrap");
  };
  
  const [form, setForm] = useState({
    co_approved_amount: 0,
    approval_notes: ''
  });

  const handleFormChange = (name, value) => {
    setForm({
        ...form,
        [name]: value
    });
  }

  useEffect(() => {
    if(isModalOpen.modalStatus) {
        document.querySelector(".wrapper-main").classList.add("hide-bg-wrap");
    }
  }, [isModalOpen.modalStatus]);
  useEffect(()=>{
    return ()=>document.querySelector(".wrapper-main").classList.remove("hide-bg-wrap");

  },[])

  const removeCommas = (value) => {
    return value.replace(/,/g, '');
  };
  return (
    <>
      {isModalOpen.modalStatus && (
        <div class="approve-po-popup">
          <div className="cross-icon" onClick={handleCloseModal}>
            <CloseOutlined />
          </div>
          <form class="details-main">
          <div className='approve'>
              <p>
              {isModalOpen.action === 'approved'? 'Approved PO':'Rejected PO'}
              </p>
            </div>
            {
              poType === 'subcontractor' && isModalOpen.action === 'approved' && user.role !== 'project manager' && <div class="projct-details notes">
              <p class="detail-para1">CO Approved Amount</p>
              <input id='input-po'  type="text" 
              // value={form.co_approved_amount} 
              //  value={form.co_approved_amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
              value={typeof form.co_approved_amount === 'string' ? form.co_approved_amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : form.co_approved_amount} 
               onChange={({ target: { value } }) => handleFormChange('co_approved_amount', value.replace(/\D/g, ''))} 
              
              //  onChange={({ target: { value } }) => handleFormChange('co_approved_amount', value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','))} 
              // onChange={({ target: { value } }) => handleFormChange('co_approved_amount', value)} 
              className="detail-para "></input>
            </div>
            }
          
            <div class="projct-details">
                <div id='approve-input' class="projct-details notes col-md-10">
                  <p class="detail-para ">Notes(Optional)</p>
                  <textarea id='input-po1' type="textarea" value={form.approval_notes} onChange={({ target: { value } }) => handleFormChange('approval_notes', value)} placeholder='Type Here..' class="detail-para1"></textarea>
                </div>
            </div>

            <div className='approve'>
                <button className='button1' type="button" onClick={handleCloseModal}>Cancel</button>
                <button className='button2' type="submit" onClick={(event) => {
                    handleStatusChange(event, isModalOpen.action, form)
                }}>{isModalOpen.action === 'approved'? 'Approve':'Reject'}</button>
            </div>
            
          </form>
        </div>
      )}
    </>
  );
};

export default ChangeStatus;
