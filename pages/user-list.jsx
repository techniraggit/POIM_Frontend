import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { Popconfirm, message, Pagination, Button } from 'antd';
import axios from 'axios';
import Link from "next/link";
import UserPopUp from "@/components/user-popup";
import { userFilterSearch, userList } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";
import Filters from "@/components/Filters";

const User_list = ({ base_url }) => {
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [users, setUsers] = useState([]);
    const [isViewUserVisible, setUserVisible] = useState(false);
    const [totalUser, setTotalUser] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')

    useEffect(() => {
        if (isIconClicked) {
            document.querySelector(".wrapper-main").classList.add("hide-bg-wrap");
        } else {
            document.querySelector(".wrapper-main").classList.remove("hide-bg-wrap");
        }
    }, [isIconClicked]);

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = () => {
        const response = userList(currentPage);
        response.then((res) => {
            if(res?.status === 200) {
                setCount(res.data.count)
                setTotalUser(res.data.results.total_users)
                setUsers(res.data.results.data);
            }
        })
    }

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            const body = JSON.stringify({ user_id: id });

            const response = await axios.delete(`${base_url}/api/admin/users`, {
                headers,
                data: body,
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
        setUserVisible(id);
        setIsIconClicked(true);
    };

    const applyFilters = (data) => {
        if(typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({...data, page: currentPage}).toString();
            const response = userFilterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setUsers(res.data.results.data);
                setUsers(res.data.results.search_query_data)
            })
        } else {
            getUsers();
        }
    }

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
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
                        <Filters search={true} role={true} applyFilters={applyFilters} currentPage={currentPage} />
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="user-list-table" className="table-hover">
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
                                            users.map((user, index) => { 
                                                return(
                                                <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{user.first_name}</td>
                                                    <td className="td-color">{user.last_name}</td>
                                                    <td>{user.user_role.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone_number}</td>
                                                    <td className="td-icon-color">
                                                        <Roles action='view_user'>
                                                            <EyeFilled onClick={() => handleIconClick(user.id)}  />
                                                            {isViewUserVisible === user.id && <UserPopUp user_id={user.id} setIsIconClicked={setIsIconClicked} />}
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
                                            )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="pagination-container">
                            <Pagination
                                current={currentPage}
                                onChange={setCurrentPage}
                                showSizeChanger={true}
                                prevIcon={
                                    <Button
                                        style={currentPage === 1 ? { pointerEvents: 'none', opacity: 0.5 } : null}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Previous
                                    </Button>
                                }
                                nextIcon={
                                    <Button
                                        style={currentPage === Math.ceil(count / 10) ? { pointerEvents: 'none', opacity: 0.5 } : null}
                                        disabled={currentPage === Math.ceil(count / 10)}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </Button>
                                }
                                onShowSizeChange={() => setCurrentPage(+1)}
                                total={count}
                                pageSize={10}
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