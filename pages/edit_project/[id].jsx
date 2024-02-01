import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { Form } from 'antd';
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import DynamicTitle from '@/components/dynamic-title.jsx';
import withAuth from "@/components/PrivateRoute";
import { fetchManagers, fetchProjectDetails, updateProject } from "@/apis/apis/adminApis";
import ProjectForm from "@/components/ProjectForm";

const repeatorData = {
    site_id: '',
    address: '',
    state: ''
}

const EditProject = () => {
    const [form] = Form.useForm();

    const router = useRouter();
    const { id } = router.query;
    const [managers, setManagers] = useState([]);
    const [formData, setFormData] = useState({
        project_name: '',
        customer_name: '',
        project_manager_id: '',
        project_sites: [],
        project_number: ''
    })

    useEffect(() => {
        fetchManagers().then((response) => {
            if(response?.data?.status) {
                setManagers(response.data.managers);
            }
        });
        fetchProjectDetails(id).then((response) => {
            if(response?.data?.status) {
                const data = response?.data?.projects;
                setFormData({
                    project_name: data?.name,
                    customer_name: data?.customer_name,
                    project_manager_id: data?.project_manager?.id,
                    project_number: data?.project_no,
                    project_sites: data?.sites
                });

                form.setFieldValue('project_name', data?.name);
                form.setFieldValue('project_number', data?.project_no);
                form.setFieldValue('project_manager_id', data?.project_manager?.id);
                form.setFieldValue('customer_name', data?.customer_name);
                data?.sites?.forEach((site, index) => {
                    Object.keys(site).forEach((key) => {
                        form.setFieldValue(key + (index), site[key])
                    })
                })
            }
        })
    }, [])

    const onFinish = () => {
        updateProject({
            ...formData,
            project_id: id
        }).then((response) => {
            if(response?.data?.status) {
                router.push('/project');
            }
        })
        .catch((error)=>{
            message.error(error.response.data.message)
        })
    };

    const onChange = (name, value, index) => {
        if (name === 'project_sites') {
            const projectSites = formData.project_sites[index];
            Object.keys(value).forEach((key) => {
                projectSites[key] = value[key];
            });

            formData.project_sites[index] = {
                ...projectSites
            };
        } else {
            formData[name] = value;
        }
        setFormData({
            ...formData
        });
    }

    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main kt">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-0 icon-text">
                                <i className="fa-solid fa-user me-3 mt-0"></i>
                                <span>Edit Project</span>
                            </li>
                        </ul>

                        <div className="vendor-form-create">
                            <ProjectForm 
                                onFinish={onFinish} 
                                onChange={onChange} 
                                form={form} 
                                formData={formData} 
                                setFormData={setFormData} 
                                managers={managers} 
                                repeatorData={repeatorData} 
                            />
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};
export { getServerSideProps }
export default withAuth(['admin', 'accounting'])(EditProject)
