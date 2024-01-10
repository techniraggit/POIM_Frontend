import React, { useEffect, useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';
// import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
// import {base_url} from '@/components/constants';
import { base_url } from './constant';


const View_Vendor = ({ vendor_id, isModalOpen, setIsModalOpen }) => {
  const [vendorData, setVenndorData] = useState([])
  const [vendorcontact, setvendorcontact] = useState([])
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        };
        const response = await axios.get(`${base_url}/api/admin/vendors?vendor_id=${vendor_id}`, { headers });
        console.log(response,'sssssssssssssssss');
        setvendorcontact(response.data.vendors_details.vendor_contact[0])
        console.log(response.data.vendors_details.vendor_contact[0],'response.data.vendors_details');
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
              <p class="detail-para">#45488</p>
            </div>

            <div class="projct-details">
              <p class="detail-para1">Company Name</p>
              <p class="detail-para">{vendorData.company_name}</p>


              <div class="pop-up-flex row">
                <div class="projct-details col-md-9">
                  <p class="detail-para1">Email Address</p>
                  <p class="detail-para">{vendorcontact.email}</p>
                  {/* <p class="detail-para">{vendorData.vendor_contact[0].email}</p> */}
                </div>

                <div class="projct-details col-md-3">
                  <p class="detail-para1">Contact No</p>
                  <p class="detail-para">{vendorcontact.phone_number}</p>
                  {/* <p class="detail-para2">{vendorData.vendor_contact[0].phone_number}</p> */}
                </div>

              </div>

              <div class="projct-details">
                <p class="detail-para1">Address</p>
                <p class="detail-para">{vendorData.address}</p>
              </div>

              <div class="pop-up-flex row">
                <div class="projct-details col-md-9">
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
export default View_Vendor;
