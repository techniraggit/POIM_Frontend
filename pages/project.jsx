import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { getServerSideProps } from "@/components/mainVariable";
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import Link from "next/link";

const Vendor = ({ base_url }) => {
    const [projects, setProjects] = useState([]);
    // const [addresses,setAddresses]=useState([]);
    const [totalProjects, setTotalProjects] = useState(0)
    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/projects`, { headers: headers });
                console.log(response.data, '55555555555555555555555555');
                setProjects(response.data.projects)
                // setAddresses(response.data.address)
                setTotalProjects(response.data.total_projects); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [])

    const siteAddress = projects.map((project) => {
        console.log(project, 'projecttttttttttttttttt');
        return project.sites.map((site) => {
            return (site.address)
        })
    })

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <li className="me-4">
                                <Link href="/create-project"><PlusOutlined /></Link>
                                {/* <i className="fa-solid fa-plus mb-3 mt-0"></i> */}
                                <span>Create New Projects</span>
                            </li>
                            <li className="me-4">
                                <span className="text-size mt-0">{totalProjects}</span>
                                <span>Total Projects</span>
                            </li>
                        </ul>
                        <div className="wrapin-form">
                            <form className="search-vendor">
                                <input className="vendor-input" placeholder="Search Vendor" />
                                <button className="vendor-search-butt">Search</button>
                            </form>
                        </div>
                        <div className="table-wrap vendor-wrap">
                            <div className="inner-table">
                                <table id="resizeMe" className="table-hover">
                                    <thead>
                                        <tr id="header-row">
                                            <th className="hedaings-tb">S No.</th>
                                            <th className="hedaings-tb">Project Name</th>
                                            <th className="hedaings-tb">Customer Name</th>
                                            <th className="hedaings-tb">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(projects) &&
                                            projects.map((project, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{project.name}</td>
                                                    
                                                    <td>{project.customer_name}</td>
                                                    {/* <td>{project.address}</td> */}
                                                    <td>
                                                        {
                                                            siteAddress.flat().map((siteAddress) => {
                                                                return (
                                                                    <td key={siteAddress} value={siteAddress}
                                                                    >
                                                                        {siteAddress}
                                                                       
                                                                    </td>)
                                                            }


                                                            )}
                                                    </td>

                                                   
                                                    <td className="td-icon-color">
                                                        <a href="#"><EyeOutlined /></a>
                                                        <a href=""><DeleteOutlined /></a>
                                                        <a href=""><EditOutlined /></a>
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
export default Vendor