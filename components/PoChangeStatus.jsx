import React, { useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';

const ChangeStatus = ({ isModalOpen, setIsModalOpen, handleStatusChange, poType }) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  return (
    <>
      {isModalOpen && (
        <div class="approve-po-popup">
          <div className="cross-icon" onClick={handleCloseModal}>
            <CloseOutlined />
          </div>
          <form class="details-main">
          <div className='approve'>
              <p>Approved PO</p>
            </div>
            {
              poType === 'subcontractor' && <div class="projct-details notes">
              <p class="detail-para1">CO Approved Amount</p>
              <input id='input-po'  type="text" value={form.co_approved_amount} onChange={({ target: { value } }) => handleFormChange('co_approved_amount', value)} className="detail-para "></input>
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
                    handleStatusChange(event, 'approved', form)
                }}>Approve</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChangeStatus;
