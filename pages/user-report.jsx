import { searchUserRoles, userFilterSearch, userList, userReportPdf, userClear } from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React,{useEffect, useState} from "react";
import { message, Popconfirm, Pagination, Button, Select } from 'antd';
import { saveAs } from "file-saver";

const userReport = () => {
    const [roleName, setRoleName] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')
    const [query, setQuery] = useState({
        filter_by_role: "",
    })


    useEffect(() => {
        if (query.filter_by_role) {
            const queryString = new URLSearchParams({
                ...query,
                page: currentPage
            }).toString();
            const response = userFilterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setUsers(res.data.results.data);
                setUsers(res.data.results.search_query_data)
            })
        } else {
            userList(currentPage).then((res) => {
                console.log(res, 'sssssppppppppppppppp');
                if (res?.data?.results.status) {
                    setUsers(res.data.results.data || []);
                }
                setCount(res.data.count)
            })
        }
    }, [currentPage, query.filter_by_role]);

    useEffect(() => {
        const response = searchUserRoles()
        response.then((res) => {
            setRoleName(res.data.roles)
        })
    },[] )
    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };


    const downloadPdf = () => {
        const queryString = new URLSearchParams({
            ...query,
            page: currentPage
        }).toString();
        const response = userReportPdf(queryString);
        response.then((res) => {
            if (res.data) {
                const fileName = `report.xls`;
                saveAs(res.data, fileName)

            }
        })
    }

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
    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="User Report" />
                    <div class="bottom-wrapp">
                        <ul class="list-icons text-list-icons">
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total Users</span>
                            </li>
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total Vendors</span>
                            </li>
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total Customers</span>
                            </li>
                            <li class="me-4">
                                <span class="text-size mb-3">200</span>
                                <span>Total PO</span>
                            </li>
                            <li>
                                <span class="text-size mb-3">200</span>
                                <span>Total Invoices</span>
                            </li>
                        </ul>
                        <div class="filter-po-report">
                            <form action="#" class="poreport-form">
                                <div class="firstly-wrap">
                                    <p class="filt-er mb-0 me-1">Filter</p>
                                    <div class="date-wrapp me-1"> <label for="">{query.from_date || "From Date"}</label>
                                        <input type="date" class="input-date" placeholder="" 
                                         onChange={(event) => {
                                            console.log(event.target, event)
                                            const selectedDate = event.target.value;
                                            setQuery(prevState => ({
                                                ...prevState,
                                                from_date: selectedDate
                                            }));
                                        }}

                                        value={query['from_date']}
                                        />
                                    </div>
                                    <div class="date-wrapp me-1"> <label for="">{query.to_date || "To Date"}</label>
                                        <input type="date" class="input-date" placeholder="" 
                                         onChange={(event) => {
                                            const selectedDate = event.target.value;
                                            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                                            setQuery(prevState => ({
                                                ...prevState,
                                                to_date: formattedDate
                                            }));
                                        }}

                                        value={query['to_date']}
                                        />
                                    </div>
                                    <div class="wrapper-selected me-0 d-flex">
                                    <Select className="line-select me-2" placeholder="PO Vendor"
                                        onChange={(value) =>
                                            setQuery(prevState => ({
                                                ...prevState,
                                                ['filter_by_role']: value
                                            }))}
                                        value={query['filter_by_role']|| "Role"}


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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleFilterClearButton()
                                                }}
                                            >
                                                Clear
                                            </button>
                                    </div>
                                </div>
                                <Button type="submit" class="export-btn" onClick={downloadPdf}>Export To XLS</Button>
                            </form>
                        </div>
                        <div class="table-wrap vendor-wrap" id="space-report">
                            <div class="inner-table" id="inner-purchase">
                            <table id="user-list-table" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">First Name</th>
                                            <th className="hedaings-tb">Last Name</th>
                                            <th className="hedaings-tb">Role</th>
                                            <th className="hedaings-tb">Email</th>
                                            <th className="hedaings-tb">Contact No</th>
                                            {/* <th className="hedaings-tb">Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(users) &&
                                            users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{user.first_name}</td>
                                                    <td className="td-color">{user.last_name}</td>
                                                    <td>{user.user_role.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone_number}</td>
                                                   
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
export default userReport