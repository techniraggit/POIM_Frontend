import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { Popconfirm, Input, message } from 'antd';
import axios from 'axios';
import Link from "next/link";
import UserPopUp from "@/components/user-popup";
const User_list = ({ base_url }) => {
    const [users, setUsers] = useState([]);
    const [isViewUserVisible, setUserVisible] = useState(false);
    const [totalUser, setTotalUser] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/users`, { headers: headers });
                console.log(response, 'aaaaaaaaaaaaa');
                setTotalUser(response.data.total_users)
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [])
    

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json', // Set content type to JSON
            };

            const body = JSON.stringify({ user_id: id }); // Use 'category_id' in the request body

            // console.log('Deleting category with ID:', );
            console.log('Request Headers:', headers);
            console.log('Request Body:', body);

            const response = await axios.delete(`${base_url}/api/admin/users`, {
                headers,
                data: body, // Send the body as data
            });

            console.log('Delete response:', response);
            message.success('user deleted successfully.');
            setTotalUser(prevTotalUser => prevTotalUser - 1);
            setUsers(preuser => preuser.filter(user => user.id !== id));
            // Reload the categories after deleting
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete the item. Please try again later.');
        }
    };
    const handleIconClick = (id) => {
        setUserVisible((prevVisible) => (prevVisible === id ? null : id));
    };


    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };
    
      const handleButtonClick = async  (event) => {
        event.preventDefault();
        try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                };
                const response = await axios.get(`${base_url}/api/search/users?query=${inputValue}`, { headers: headers });
                console.log(response.data.search_query_data, 'aaaaaaaaaaaaa========');
                setUsers(response.data.search_query_data)
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
      };
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
                                <span className="text-size mt-0">{totalUser}</span>
                                <span>Total Users</span>
                            </li>
                        </ul>
                        <div className="wrapin-form add-clear-wrap">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Users" />
                                <button className="vendor-search-butt">Search</button>
                            </form>
                            <button type="submit" className="clear-button ms-3">Clear</button>
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
                                                        <EyeFilled onClick={() => handleIconClick(user.id)} />
                                                        {isViewUserVisible === user.id && <UserPopUp user_id={user.id} />}
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this item?"
                                                            onConfirm={() => handleDelete(user.id)}
                                                            okText="Yes"
                                                            cancelText="No"

                                                        >

                                                            <DeleteFilled />

                                                        </Popconfirm>
                                                        {/* <Link></> */}
                                                        <Link href={`/edit_user/${user.id}`} className="me-2"><EditFilled /></Link>
                                                    </td>
                                                </tr>
                                            ))}

                                        {/* <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Turner Construction</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>ts123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color">
                                            <a href="#"><EyeOutlined /></a> 
                                                <i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr> */}
                                        {/* <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Aecom</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>aecom123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr>
                                        <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Sam Billings</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>sam123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr>
                                        <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Pinnacle Builders</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>ts123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr>
                                        <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Turner Construction</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>aecom123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr>
                                        <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Aecom</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>sam123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr>
                                        <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Sam Billings</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>aecom123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr>
                                        <tr>
                                            <td>#45488</td>
                                            <td className="td-color">Turner Construction</td>
                                            <td>#456 - Upper Link, PA</td>
                                            <td>sam123@gmail.com</td>
                                            <td>123 654 987</td>
                                            <td className="td-icon-color"><i className="fa-solid fa-eye"></i><i
                                                className="fa-solid fa-trash"></i><i className="fa-solid fa-pen"></i></td>
                                        </tr> */}
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