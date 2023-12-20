import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import axios from 'axios';
import Link from "next/link";
const User_list = ({ base_url }) => {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/users`, { headers: headers });
                console.log(response.data.data, '55555555555555555555555555');
                setUsers(response.data.data); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [])


    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="User" />

                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <li className="me-4">
                                <Link href="/add-user" className="d-block mb-2"><PlusOutlined /></Link>
                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <span>Create New User</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mt-0">22</span>
                                <span>Total Users</span>
                            </li>
                        </ul>
                        <div className="wrapin-form">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Users" />
                                <button className="vendor-search-butt">Search</button>
                            </form>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="resizeMe" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">First Name</th>
                                            <th className="hedaings-tb">Last Name</th>
                                            <th className="hedaings-tb">Address</th>
                                            <th className="hedaings-tb">Email</th>
                                            <th className="hedaings-tb">Contact No</th>
                                            <th className="hedaings-tb">Action</th>                     
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Array.isArray(users) &&
                                            users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{user.first_name}</td>
                                                    <td className="td-color">{user.last_name}</td>
                                                    <td>{user.address}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone_number}</td>
                                                    <td className="td-icon-color">
                                                    <a href="#" className="me-2"><EyeFilled /></a> 
                                            <a href="#" className="me-2"><DeleteFilled /></a> 
                                            <a href="#" className="me-2"><EditFilled /></a> 
                                                    </td>
                                                </tr>
                                            ))}

                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export { getServerSideProps }
export default User_list