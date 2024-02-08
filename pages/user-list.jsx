import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { Popconfirm, Input, message, Pagination, Button } from 'antd';
import axios from 'axios';
import Link from "next/link";
import UserPopUp from "@/components/user-popup";
import { userSearch, userClear } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";
const User_list = ({ base_url }) => {
    const [users, setUsers] = useState([]);
    const [isViewUserVisible, setUserVisible] = useState(false);
    const [totalUser, setTotalUser] = useState(0)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    // console.log(currentPage);

    useEffect(() => {
        const fetchroles = async () => {
            // setCurrentPage(page);
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/users?page=${currentPage}`, { headers: headers });
                setCount(response.data.count)
                setTotalUser(response.data.results.total_users)
                setUsers(response.data.results.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [currentPage])


    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json', // Set content type to JSON
            };

            const body = JSON.stringify({ user_id: id }); // Use 'category_id' in the request body


            const response = await axios.delete(`${base_url}/api/admin/users`, {
                headers,
                data: body, // Send the body as data
            });

            message.success('user deleted successfully.');
            setTotalUser(prevTotalUser => prevTotalUser - 1);
            setUsers(preuser => preuser.filter(user => user.id !== id));
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

    const handleButtonClick = async (event) => {
        event.preventDefault();
        userSearch(inputValue).then((response) => {
            setUsers(response.data.search_query_data)
        })
    };
    const handleClearButtonClick = () => {
        setInputValue('');
        userClear().then((res) => {
            setUsers(res.data.data);
        })
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="User" />

                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <Roles action='add_user'>
                                <li className="me-4">
                                    <Link href="/add-user" className="d-block mb-2"><PlusOutlined /></Link>
                                    <span>Create New User</span>
                                </li>
                            </Roles>

                            <li className="me-4">
                                <span className="text-size mt-0">{totalUser}</span>
                                <span>Total Users</span>
                            </li>
                        </ul>
                        <div className="wrapin-form add-clear-wrap">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Users"
                                    value={inputValue} onChange={handleInputChange}
                                />
                                <button className="vendor-search-butt"
                                    onClick={handleButtonClick}
                                >Search</button>
                            </form>
                            <button type="submit" className="clear-button ms-3" onClick={handleClearButtonClick}>Clear</button>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="resizeMe" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">First Name</th>
                                            <th className="hedaings-tb">Last Name</th>
                                            <th className="hedaings-tb">Role</th>
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
                                                    <td>{user.user_role.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone_number}</td>
                                                    <td className="td-icon-color">
                                                        <Roles action='view_user'>
                                                            <EyeFilled onClick={() => handleIconClick(user.id)} />
                                                            {isViewUserVisible === user.id && <UserPopUp user_id={user.id} />}
                                                        </Roles>
                                                        <Roles action='delete_user'>
                                                            <Popconfirm
                                                                title="Are you sure you want to delete this item?"
                                                                onConfirm={() => handleDelete(user.id)}
                                                                okText="Yes"
                                                                cancelText="No"

                                                            >
                                                                <DeleteFilled />
                                                            </Popconfirm>
                                                        </Roles>
                                                        <Roles action='edit_user'>
                                                            <Link href={`/edit_user/${user.id}`} className="me-2"><EditFilled /></Link>
                                                        </Roles>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                        <div className="pagination-container">
                            <Pagination
                                // defaultCurrent={2}
                                current={currentPage}
                                onChange={setCurrentPage}
                                showSizeChanger={true}
                                prevIcon={<Button>Previous</Button>}
                                nextIcon={<Button>Next</Button>}
                                onShowSizeChange={() => setCurrentPage(+1)}
                                total={count}
                                pageSize={10} // Number of items per page

                            />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export { getServerSideProps }
export default withAuth(['admin', 'accounting', 'project manager', 'director', 'department manager'])(User_list);
// export default User_list