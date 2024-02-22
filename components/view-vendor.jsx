import React, { useEffect, useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';
// import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
// import {base_url} from '@/components/constants';
import { base_url } from './constant';
import withAuth from './PrivateRoute';


const View_Vendor = ({ vendor_id, isModalOpen, setIsModalOpen, clickedIndex,setIsIconClicked }) => {
  const [vendorData, setVenndorData] = useState([])
  const [vendorcontact, setvendorcontact] = useState([])
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsIconClicked(false);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        };
        const response = await axios.get(`${base_url}/api/admin/vendors?vendor_id=${vendor_id}`, { headers });
        setvendorcontact(response.data.vendors_details.vendor_contact[0])
        setVenndorData(response.data.vendors_details)
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    }
    fetchRoles();
  }, [vendor_id])
  return (
    <>
      {isModalOpen && (
        <div class="approve-po">
          <div className="cross-icon" onClick={handleCloseModal}>
            <CloseOutlined />
          </div>
          <form class="details-main">
            <div class="projct-details">
              <p class="detail-para1">S No.</p>
              <p className="detail-para">{clickedIndex !== null ? clickedIndex + 1 : ''}</p>
            </div>

            <div class="projct-details d-block">
              <p class="detail-para1">Company Name</p>
              <p class="detail-para">{vendorData.company_name}</p>


              <div class="pop-up-flex row justify-content-start">
                <div class="projct-details col-sm-8">
                  <p class="detail-para1">Email Address</p>
                  <p class="detail-para">{vendorcontact.email}</p>
                </div>

                <div class="projct-details col-md-3">
                  <p class="detail-para1">Contact No</p>
                  <p class="detail-para">{vendorcontact.phone_number}</p>
                </div>

              </div>

              <div class="projct-details">
                <p class="detail-para1">Address</p>
                <p class="detail-para">{vendorData.address}</p>
              </div>

              <div class="pop-up-flex row justify-content-start">
                <div class="projct-details col-sm-8">
                  <p class="detail-para1">State / Province</p>
                  <p class="detail-para">Ontario</p>
                </div>
                <div class="projct-details col-md-3">
                  <p class="detail-para1">Country</p>
                  <p class="detail-para2">Canada</p>
                </div>
              </div>

            </div>
          </form>
        </div>
      )}
    </>
  );
};
// export { getServerSideProps }
export default withAuth(['admin','accounting','project manager','department manager',
'director','site superintendent','project coordinator','marketing','health & safety','estimator','shop'])
(View_Vendor)
// export default View_Vendor;
