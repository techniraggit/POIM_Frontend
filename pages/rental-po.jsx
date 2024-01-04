import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, DatePicker, Space, message } from "antd";
import { getServerSideProps } from "@/components/mainVariable";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import axios from 'axios';
import '../styles/style.css'
import { MinusOutlined, PlusOutlined, CaretDownFilled } from '@ant-design/icons';
import moment from 'moment';
import { useRouter } from 'next/router';
import Rental from "@/components/rental_po";
// import "antd/dist/antd.css";



const Create_po = () => {
    const [form] = Form.useForm();
    return (
        <>
            <div className="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Purchase Orders' />
                    <div className="bottom-wrapp">

                        <ul class=" create-icons">
                            <li class="icon-text react-icon">
                                <PlusOutlined />
                                <span>Create New Purchase Order</span>
                            </li>
                        </ul>
                        {/* ... (your existing code) */}
                        <div className="choose-potype round-wrap">
                            <div className="inner-choose">
                                {/* <Form onFinish={onFinish} form={form} className="file-form"> */}
                                    <Rental />
                                {/* </Form> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export { getServerSideProps };
export default Create_po;