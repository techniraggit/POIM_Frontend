import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getServerSideProps } from "@/components/mainVariable";
import { Popconfirm, Input, message, Pagination, Button, Select } from 'antd';
import axios from 'axios';
import Link from "next/link";
import UserPopUp from "@/components/user-popup";
import { userSearch, userClear, searchUserRoles, userFilterSearch } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";
const User_list = ({ base_url }) => {
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [users, setUsers] = useState([]);
    const [isViewUserVisible, setUserVisible] = useState(false);
    const [totalUser, setTotalUser] = useState(0)
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    const [roleName, setRoleName] = useState([]);
    const [query, setQuery] = useState({
        filter_by_role: "",
    })


    useEffect(() => {
        if (isIconClicked) {
            document.querySelector(".wrapper-main").classList.add("hide-bg-wrap");
        } else {
            document.querySelector(".wrapper-main").classList.remove("hide-bg-wrap");
        }
    }, [isIconClicked]);


    useEffect(() => {
        const fetchroles = async () => {
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
        setUserVisible(id);
        setIsIconClicked(true);
    };


    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async (event) => {
        event.preventDefault();
        userSearch(inputValue).then((response) => {
            setUsers(response.data.results.search_query_data)
        })
    };
    const handleClearButtonClick = () => {
        setInputValue('');
        userClear().then((res) => {
            setUsers(res.data.results.data);
        })
    };
    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };
    useEffect(() => {
        const response = searchUserRoles()
        response.then((res) => {
            setRoleName(res.data.roles)
        })
    }, [])

    const handleFilterClearButton = () => {
        setQuery(prevState => ({
            ...prevState,
            ['filter_by_role']: '',

        }))
        userClear().then((res) => {
            setUsers(res.data.results.data);
            setCount(res.data.count)

        })

    }

    useEffect(() => {
        if (query) {
            const queryString = new URLSearchParams(query).toString();
            const response = userFilterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setUsers(res.data.results.data);
                setUsers(res.data.results.search_query_data)

            })
        }
    }, [query])

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
                        <div className="searchbar-wrapper">
                            <div className="Purchase-form user-div-wrap">

                                <div className="user-wrapsearch d-flex align-items-center">
                                    <form className="search-vendor">
                                        <input className="vendor-input" placeholder="Search User"
                                            value={inputValue} onChange={handleInputChange}
                                        />
                                        <button className="vendor-search-butt"
                                            onClick={handleButtonClick}
                                        >Search</button>
                                    </form>
                                    <button type="submit" className="clear-button ms-3"
                                        onClick={handleClearButtonClick}
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="purchase-filter invoice-filter ms-0">
                                    <span className="filter-span">Filter :</span>
                                    <Select className="line-select me-2" placeholder="Role"
                                        onChange={(value) =>
                                            setQuery(prevState => ({
                                                ...prevState,
                                                ['filter_by_role']: value
                                            }))}
                                        value={query['filter_by_role']}
                                    >
                                        {roleName.map((entry) =>

                                        (
                                            <Select.Option key={entry.name} value={entry.name}>
                                                {entry.name}
                                            </Select.Option>
                                        )
                                        )}

                                    </Select>
                                    <button type="submit" className="clear-button ms-3"
                                        onClick={handleFilterClearButton}
                                    >
                                        Clear
                                    </button>
                                </div>



                                {/* -------------------------- */}

                                {/* <Select className="line-select me-2" placeholder="PO Vendor" >
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select>
                                    <Select className="line-select" placeholder="PO Status" >
                                        <Option>Invoice</Option>
                                        <Option>Invoice</Option>
                                    </Select> */}

                                {/* <Button className="click-btn"><span>Type</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Vendor</span><i className="fa-solid fa-chevron-down"></i></Button>
                                    <Button className="click-btn"><span>PO Status</span><i className="fa-solid fa-chevron-down"></i></Button> */}
                                {/* </div> */}
                            </div>
                        </div>
                        {/* <div className="wrapin-form add-clear-wrap">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Users"
                                    value={inputValue} onChange={handleInputChange}
                                />
                                <button className="vendor-search-butt"
                                    onClick={handleButtonClick}
                                >Search</button>
                            </form>
                            <button type="submit" className="clear-button ms-3" onClick={handleClearButtonClick}>Clear</button>
                        </div> */}
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
                                // defaultCurrent={2}
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