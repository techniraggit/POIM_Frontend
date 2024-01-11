import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import axios from 'axios';
import { Table, Button, message, Popconfirm, Input } from 'antd';
import { getServerSideProps } from "@/components/mainVariable";
import { PlusOutlined, EyeFilled, DeleteFilled, EditFilled } from '@ant-design/icons'
import Link from "next/link";
import ProjectPopup from "@/components/project-popup";

const Vendor = ({ base_url }) => {
    
    const [projects, setProjects] = useState([]);
    const [isViewProjectVisible, setProjectVisible] = useState(false);
    // const [addresses,setAddresses]=useState([]);
    const [totalProjects, setTotalProjects] = useState(0)
    useEffect(() => {
        const fetchroles = async () => {
            try {
                const headers = {
                    Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
                }
                const response = await axios.get(`${base_url}/api/admin/projects`, { headers: headers });
                console.log(response.data.projects, '55555555555555555555555555');
                setProjects(response.data.projects)
                // setAddresses(response.data.address)
                setTotalProjects(response.data.total_projects); // Assuming the API response is an array of projects
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        }
        fetchroles();
    }, [])

    const siteAddress = projects?.map((project) => {
        return project.sites.map((site) => {
            return (site.address)
        })
    })

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json', // Set content type to JSON
            };

            const body = JSON.stringify({ project_id: id }); // Use 'category_id' in the request body

            // console.log('Deleting category with ID:', );
            console.log('Request Headers:', headers);
            console.log('Request Body:', body);

            const response = await axios.delete(`${base_url}/api/admin/projects`, {
                headers,
                data: body, // Send the body as data
            });

            console.log('Delete response:', response);
            message.success('project deleted successfully.');
            setTotalProjects(prevTotalProjects => prevTotalProjects - 1);
            setProjects(preproject => preproject.filter(project => project.project_id !== id));
            // Reload the categories after deleting
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete the item. Please try again later.');
        }
    };
    const handleIconClick = (id) => {
        console.log(id,'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
        setProjectVisible((prevVisible) => (prevVisible === id ? null : id));
    };

    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp">
                        <ul className="list-icons">
                            <li className="me-4 create-projects">
                                <Link href="/create-project" className="d-block mb-2"><PlusOutlined /></Link>
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
                                <input className="vendor-input" placeholder="Search Vendor" type="text" />
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
                                            <th className="hedaings-tb">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(projects) &&
                                            projects.map((project, index) => 
                                            // {
                                            //     console.log(project,'project namesssssssssssss');
                                                (
                                                
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{project.name}</td>
                                                    {/* <td className="td-color">{vendor.name}</td> */}
                                                    {/* <td>
                                                        {vendor.vendor_contact.map((vendor_contact, index) => (
                                                            <td>{vendor_contact.name}<br /></td>
                                                        ))}
                                                    </td> */}
                                                    <td>{project.customer_name}</td>
                                                    {/* <td>{project.address}</td> */}
                                                    <td>
                                                    {project.sites[0].address}
                                                        
                                                        {/* {
                                                            siteAddress.flat().map((siteAddress) => {
                                                                return (
                                                                    <td key={siteAddress} value={siteAddress}
                                                                    >
                                                                        {siteAddress}
                                                                    </td>)
                                                            }


                                                            )} */}
                                                    </td>

                                                    {/* <td>
                                                        {vendor.vendor_contact.map((vendor_contact, index) => (
                                                            <td>{vendor_contact.name}<br /></td>
                                                        ))}
                                                    </td> */}
                                                    <td className="td-icon-color">
                                                    <EyeFilled onClick={() => handleIconClick(project.project_id)} />
                                                        {isViewProjectVisible === project.project_id && <ProjectPopup project_id={project.project_id} />} 
                                                        
                                                        

                                                        <Popconfirm
                                                            title="Are you sure you want to delete this item?"
                                                            onConfirm={() => handleDelete(project.project_id)}
                                                            okText="Yes"
                                                            cancelText="No"
                                                            
                                                        >
                                                            
                                                            <DeleteFilled />
                                                            
                                                        </Popconfirm>
                                                        <Link href={`/edit_project/${project.project_id}`} className="me-2"><EditFilled /></Link>
                                                    </td>
                                                </tr>
                                            )
                                        // }
                                            )}

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