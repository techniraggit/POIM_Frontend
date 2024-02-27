import { userFilterSearch, userList, userReportPdf } from "@/apis/apis/adminApis";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React,{useEffect, useState} from "react";
import { Pagination, Button } from 'antd';
import ReportHeader from "@/components/ReportHeader";
import { saveAs } from "file-saver";
import Filters from "@/components/Filters";

const userReport = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('');

    const getUsers = () => {
        userList(currentPage).then((res) => {
            if (res?.data?.results.status) {
                setUsers(res.data.results.data || []);
            }
            setCount(res.data.count)
        })
    }

    useEffect(() => {
        getUsers();
    }, []);

    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    const downloadPdf = () => {
        const queryString = new URLSearchParams({
            ...data
        }).toString();
        const response = userReportPdf(queryString);
        response.then((res) => {
            if (res.data) {
                const fileName = `report.xls`;
                saveAs(res.data, fileName)
            }
        })
    }

    const applyFilters = (data) => {
        if(typeof data === 'object' && Object.keys(data).length > 0) {
            const queryString = new URLSearchParams({ ...data }).toString();
            const response = userFilterSearch(queryString);
            response.then((res) => {
                setCount(res.data.count)
                setUsers(res.data.results.search_query_data)
            });
        } else {
            getUsers();
        }
    }

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="User Report" />
                    <div class="bottom-wrapp">
                        <ReportHeader />
                        <Filters toDate={true} fromDate={true} download={true} role={true} applyFilters={applyFilters} currentPage={currentPage} downloadPdf={downloadPdf} />
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(users) &&
                                            users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{calculateStartingSerialNumber() + index}</td>
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

export default userReport