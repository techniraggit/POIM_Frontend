import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useState, useEffect } from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import { Form, message } from 'antd';
import { useRouter } from 'next/router';
import withAuth from "@/components/PrivateRoute";
import { createProject, fetchManagers,fetchPoNumbers } from "@/apis/apis/adminApis";
import ProjectForm from "@/components/ProjectForm";
import { Spin } from 'antd';

const repeatorData = {
    // name: '',
    address: '',
    state: 'ON',
}

const CreateProject = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_name: '',
        customer_name: '',
        project_manager_id: '',
        project_sites: [repeatorData],
        project_number: '',
    })

    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        fetchManagers().then((response) => {
            if (response?.data?.status) {
                setManagers(response.data.managers);
            }
        })
    }, [])

    const onFinish = () => {
        setLoading(true);
        createProject(formData).then((response) => {
            if (response?.data?.status) {
                message.success("Project created successfully");
                router.push('/project');
            }
        }).catch((error) => {
            setLoading(false);
            message.error(error.response.data.message)
        })
    }

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
    useEffect(()=>{
        const response=fetchPoNumbers()
        response.then((res) => {
            console.log(res,'jjjjjjjjjjj');
            // if (res?.data?.status) {
            // }
        })

    },[])

    return (
        <>
            <DynamicTitle title="Add User" />
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading="Project" />
                    <div className="bottom-wrapp">
                        <ul className=" create-icons">
                            <li className="me-0 icon-text">
                                <i className="fa-solid fa-user me-3 mt-0"></i>
                                <span>Create New Project</span>
                            </li>
                        </ul>

                        <div className="vendor-form-create">
                            <Spin spinning={loading}>
                                <ProjectForm onFinish={onFinish}
                                    onChange={onChange} form={form} formData={formData}
                                    setFormData={setFormData} managers={managers}
                                    repeatorData={repeatorData}
                                    loading={loading} />
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withAuth(['admin', 'accounting'])(CreateProject);