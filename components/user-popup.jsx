import React, { useEffect, useState } from 'react';
import '../styles/style.css'; // Import your stylesheet
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { base_url } from './constant';
import withAuth from './PrivateRoute';

const UserPopUp = ({ user_id,setIsIconClicked }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userData, setUserData] = useState([])
  const [userRoles, setUserRoles] = useState([])
  //   const[vendorcontact,setvendorcontact]=useState([])



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

        const response = await axios.get(`${base_url}/api/admin/users?id=${user_id}`, { headers });
        setUserRoles(response.data.data.user_role.name);
        //   setvendorcontact(response.data.vendors_details.vendor_contact[0])
        setUserData(response.data.data)
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    }
    fetchRoles();
  }, [user_id])
  return (
    <>
      {isModalOpen && (
        // <div className="approve-main">
          <div className="approve-po">
            <div className="cross-icon" onClick={handleCloseModal}>
              <CloseOutlined />
            </div>
            <div className="details-main">
              <div className="projct-details">
                <p className="detail-para">Role</p>
                <button className="user-pop-up-butt">{userRoles}</button>
              </div>
              <div className="pop-up-flex row">
                <div className="projct-details col-sm-8">
                  <p className="detail-para1">First Name</p>
                  <p className="detail-para">{userData.first_name}</p>
                </div>
                <div className="projct-details col-sm-4">
                  <p className="detail-para1">Last Name</p>
                  <p className="detail-para">{userData.last_name}</p>
                </div>
              </div>
              <div className="pop-up-flex row">
                <div className="projct-details col-sm-8">
                  <p className="detail-para1">Email Address</p>
                  <p className="detail-para">{userData.email}</p>
                </div>
                <div className="projct-details col-sm-4">
                  <p className="detail-para1">Contact No</p>
                  <p className="detail-para">{userData.phone_number}</p>
                </div>
              </div>
              <div className="projct-details">
                <p className="detail-para1">Address</p>
                <p className="detail-para">{userData.address}</p>
              </div>
              <div className="pop-up-flex row">
                <div className="projct-details col-sm-8">
                  <p className="detail-para1">State / Province</p>
                  <p className="detail-para">{userData.state}</p>
                </div>
                <div className="projct-details col-sm-4">
                  <p className="detail-para1">Country</p>
                  <p className="detail-para3">{userData.country}</p>
                </div>
              </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
};
export default withAuth(['admin','accounting','project manager','director','department manager'])(UserPopUp);

// export default UserPopUp;
