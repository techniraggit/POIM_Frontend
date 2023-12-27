import React, { useEffect, useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';
// import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
// import {base_url} from '@/components/constants';
import { base_url } from './constant';


const View_Vendor = ({vendor_id}) => {

  const [isModalOpen, setIsModalOpen] = useState(true);
  const[vendorData,setVenndorData]=useState([])
  const[vendorcontact,setvendorcontact]=useState([])
   
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(()=>{
    const fetchRoles = async () => {
      try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  };
  const response =await axios.get(`${base_url}/api/admin/vendors?vendor_id=${vendor_id}`, { headers });
  setvendorcontact(response.data.vendors_details.vendor_contact[0])
  setVenndorData(response.data.vendors_details)
}catch (error) {
  console.error('Error fetching vendors:', error);
}
    }
    fetchRoles();
  },[vendor_id])
  return (
    <>
      {isModalOpen && (
        <div className="approve-po">
          <div className="cross-icon" onClick={handleCloseModal}>
            <CloseOutlined />
          </div>
          <form className="details-main">
            {/* Project Details */}
            <div className="projct-details">
              <label className="detail-para1">S No.</label>
              
              {/* <input className="detail-para" placeholder="#45488" /> */}
            </div>

            <div className="projct-details">
              <label className="detail-para1">Company Name</label>
              <p>{vendorData.company_name}</p>
              {/* <input className="detail-para" placeholder="Justin" /> */}
            </div>

            {/* Email and Contact */}
            <div className="pop-up-flex row">
              <div className="projct-details col-md-9">
                <label className="detail-para1">Email Address</label>
                <p>{vendorcontact.email}</p>
                {/* <p>{vendorData.vendor_contact[0].email}</p> */}
                {/* <input className="detail-para" placeholder="Justin@gmail.com" /> */}
              </div>

              <div className="projct-details col-md-3">
                <label className="detail-para1">Contact No</label>
                <p>{vendorcontact.phone_number}</p>
                {/* <p>{vendorData.vendor_contact[0].phone_number}</p> */}
                {/* <input className="detail-para" placeholder="123654789" /> */}
              </div>
            </div>

            {/* Address */}
            <div className="projct-details">
              <label className="detail-para1">Address</label>
              <p>{vendorData.address}</p>
              {/* <input className="detail-para" placeholder="#456 - Upper Link, PA" /> */}
            </div>

            {/* State/Province and Country */}
            <div className="pop-up-flex row">
              <div className="projct-details col-md-9">
                <label className="detail-para1">State / Province</label>
                <input className="detail-para" placeholder="Ontario" />
              </div>
              <div className="projct-details col-md-3">
                <label className="detail-para1">Country</label>
                <input className="detail-para2" placeholder="Canada" />
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
