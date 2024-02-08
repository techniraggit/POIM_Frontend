import React, { useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';

const ChangeStatus = ({ isModalOpen, setIsModalOpen, handleStatusChange, poType }) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const [form, setForm] = useState({
    approve_amount: 0,
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
        <div class="approve-po">
          <div className="cross-icon" onClick={handleCloseModal}>
            <CloseOutlined />
          </div>
          <form class="details-main">
            {
              poType === 'subcontractor' && <div class="projct-details">
              <p class="detail-para1">CO Approved Amount</p>
              <input type="text" value={form.approve_amount} onChange={({ target: { value } }) => handleFormChange('approve_amount', value)} className="detail-para"></input>
            </div>
            }

            <div class="projct-details">
              <div class="pop-up-flex row">
                <div class="projct-details col-md-9">
                  <p class="detail-para1">Notes(Optional)</p>
                  <input type="textarea" value={form.approval_notes} onChange={({ target: { value } }) => handleFormChange('approval_notes', value)} class="detail-para"></input>
                </div>
              </div>
            </div>

            <div>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" onClick={(event) => {
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
