import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import axios from 'axios';
import { message, Popconfirm ,Pagination,Button} from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import Link from "next/link";
import ProjectPopup from "@/components/project-popup";
import { projectSearch, projectClear } from "@/apis/apis/adminApis";
import withAuth from "@/components/PrivateRoute";
import Roles from "@/components/Roles";

const Vendor = ({ base_url }) => {
    const [projects, setProjects] = useState([]);
    const [isViewProjectVisible, setProjectVisible] = useState(false);
    const [totalProjects, setTotalProjects] = useState(0)
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [count, setCount] = useState('')

    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/projects?page=${currentPage}`, { headers: headers });
                setCount(response.data.count)
                setProjects(response.data.results.projects)
                setTotalProjects(response.data.results.total_projects);
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
                'Content-Type': 'application/json',
            };

            const body = JSON.stringify({ project_id: id });

            const response = await axios.delete(`${base_url}/api/admin/projects`, {
                headers,
                data: body,
            });

            message.success('project deleted successfully.');
            setTotalProjects(prevTotalProjects => prevTotalProjects - 1);
            setProjects(preproject => preproject.filter(project => project.project_id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete the item. Please try again later.');
        }
    };

    const handleIconClick = (id) => {
        setProjectVisible((prevVisible) => (prevVisible === id ? null : id));
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async (event) => {
        event.preventDefault();
        projectSearch(inputValue).then((response) => {
            setProjects(response.data.results.search_project_data);
        })
    };

    const handleClearButtonClick = () => {
        setInputValue('');
        projectClear().then((res) => {
            setProjects(res.data.results.projects);
        })
    };
    const calculateStartingSerialNumber = () => {
        return (currentPage - 1) * 10 + 1;
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp users-list-wrapin">
                        <ul className="list-icons">
                            <Roles action="add_project">
                                <li className="me-4 create-projects">
                                    <Link href="/create-project" className="d-block mb-2"><PlusOutlined /></Link>
                                    <span>Create New Projects</span>
                                </li>
                            </Roles>

                            <li className="me-4">
                                <span className="text-size mt-0">{totalProjects}</span>
                                <span>Total Projects</span>
                            </li>
                        </ul>
                        <div className="wrapin-form add-clear-wrap">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Projects"
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
                                <table id="project-table" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">Project Name</th>
                                            <th className="hedaings-tb">Customer Name</th>
                                            <th className="hedaings-tb">Address</th>
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(projects) &&
                                            projects.map((project, index) => (
                                                <tr key={index}>
                                                   <td>{calculateStartingSerialNumber() + index}</td>
                                                    <td>{project.name}</td>
                                                    <td>{project.customer_name}</td>
                                                    <td>{project.sites[0].address}</td>
                                                    <td className="td-icon-color">
                                                        <Roles action="view_project">
                                                            <EyeFilled onClick={() => handleIconClick(project.project_id)} />
                                                            {isViewProjectVisible === project.project_id && <ProjectPopup project_id={project.project_id} />}
                                                        </Roles>
                                                        <Roles action="delete_project">
                                                            <Popconfirm
                                                                title="Are you sure you want to delete this item?"
                                                                onConfirm={() => handleDelete(project.project_id)}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <DeleteFilled />
                                                            </Popconfirm>
                                                        </Roles>
                                                        <Roles action='edit_project'>
                                                            <Link href={`/edit_project/${project.project_id}`} className="me-2"><EditFilled /></Link>
                                                        </Roles>
                                                    </td>
                                                </tr>
                                            )
                                            )}
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
export default withAuth(['admin', 'accounting', 'project manager', 'department manager',
    'director', 'site superintendent', 'project coordinator', 'marketing', 'health & safety', 'estimator', 'shop'])
    (Vendor)