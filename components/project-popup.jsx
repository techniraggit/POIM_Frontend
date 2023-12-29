import React, { useEffect, useState } from 'react';
import '../styles/style.css';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { base_url } from './constant';


const ProjectPopup = ({project_id}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        console.log(project_id,'@@@@@@@@@@@@@@@@@@@@');
        const fetchRoles = async () => {
          try {
            const headers = {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            };
            // console.log(user_id, 'user_id>>>>>>>>>>>')
            const response = await axios.get(`${base_url}/api/admin/projects?project_id=${project_id}`, { headers });
            console.log(response.data, 'hereeeeeeeeee');
            // setUserRoles(response.data.data.user_role.name);
            //   setvendorcontact(response.data.vendors_details.vendor_contact[0])
            // setUserData(response.data.data)
          } catch (error) {
            console.error('Error fetching vendors:', error);
          }
        }
        fetchRoles();
      }, [project_id])
   
    return (
        <>
        {isModalOpen && (
        <div className="approve-main">
            <div className="approve-po">
                <div className="cross-icon" onClick={handleCloseModal}>
                    <CloseOutlined />
                </div>
                <div className="details-main">
                    <div className="projct-details">
                        <p className="detail-para">Project No.</p>
                        <button className="vendor-pop-up-butt">#45488</button>
                    </div>

                    <div className="projct-details">
                        <p className="detail-para1">Customer Name</p>
                        <p className="detail-para">Justin Spencer</p>
                    </div>

                    <div className="pop-up-flex">
                        <div className="projct-details">
                            <p className="detail-para1">Email Address</p>
                            <p className="detail-para">Justin@gmail.com</p>
                        </div>

                        <div className="projct-details">
                            <p className="detail-para1">Contact No</p>
                            <p className="detail-para">123654789</p>
                        </div>
                    </div>

                    <div className="projct-details">
                        <p className="detail-para1">Project Address</p>
                        <p className="detail-para">#456 - Upper Link, PA</p>
                    </div>

                    <div className="pop-up-flex">
                        <div className="projct-details">
                            <p className="detail-para1">State / Province</p>
                            <p className="detail-para">Austin</p>
                        </div>
                        <div className="projct-details">
                            <p className="detail-para1">Country</p>
                            <p className="detail-para">USA</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         )}
        </>
    );
};

export default ProjectPopup;
