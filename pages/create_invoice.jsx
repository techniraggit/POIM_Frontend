import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Form, Input, Button, Select } from 'antd';
import '../styles/style.css'
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchPoNumbers, fetchPoNumbr } from "@/apis/apis/adminApis";
import Material_invoice from "@/components/material_invoice";

const { Option } = Select;

const Create_Invoice = () => {
    const [poNumber, setPoNumber] = useState([]);
    const [responseData,setResponseData]=useState([]);
    

    const onFinish = (values) => {
        // Handle form submission here
        console.log('Received values:', values);
    };
    useEffect(() => {
        const response = fetchPoNumbr()
        response.then((res) => {
            console.log(res.data.data, 'sssssssssssssssss');
            if (res?.data?.status) {
                setPoNumber([...res.data.data]);
            }
        })

    }, [])

    const fetchPoNumber = (id) => {
        console.log(id, 'iddddd');
        const response = fetchPoNumbers(id)
        console.log(response, 'iiiiiiiiiiiiiiii');
        response.then((res) => {
            console.log(res.data.data, 'wwwwwwwwww');
            const data=res.data.data;
            setResponseData(data)
            
        })
    }
   
    return (
        <>
            <div class="wrapper-main">
                <Sidebar />
                <div className="inner-wrapper">
                    <Header heading='Invoice' />
                    <div class="bottom-wrapp-purchase">
                        <div class="invoicedropdown-warp">
                        </div>
                        <div class="wrapp-in-voice">
                            <ul class="bg-colored-ul">
                                <li class="bg-li">
                                    <i class="fa-solid fa-plus me-3 mt-0"></i>
                                    <span>View Purchase Order</span>
                                </li>

                            </ul>

                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="selectwrap  shipment-caret aligned-tex">
                                        <Select placeholder="Select PO Type" id="create-invoice"
                                            class="js-states form-control file-wrap-select bold-select"
                                            onChange={(value) => fetchPoNumber(value)}
                                        >
                                            {poNumber.map((entry) => (
                                                <Select.Option key={entry.po_id} value={entry.po_id}>
                                                    {entry.po_number}
                                                </Select.Option>

                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            {
                                responseData.po_type== 'material'&&(
                                    <>
                                    <Material_invoice data={responseData}/>
                                    </>
                                )
                            }
                            {/* <div class="row space-raw  btm-space">
                                <div class="col-lg-4 col-md-6">
                                    <div class="wrap-box">
                                        <label>
                                            Company Name
                                        </label>
                                        <input
                                            label="Company Name"
                                            for="name"
                                            name="company_name"
                                            type="text"
                                            value={vendorForm.company_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div class="col-lg-4 col-md-6">
                                    <div class="wrap-box">
                                        <label>
                                            Email
                                        </label>
                                        <input
                                            for="name"
                                            name="email"
                                            type="text"
                                            value={vendorForm.email}

                                            onChange={handleChange}
                                        />

                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="wrap-box">
                                        <label>Contact Number</label>
                                        <input
                                            for="name"
                                            name="phone"
                                            type="text"
                                            value={vendorForm.phone}

                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="wrap-box mb-0">
                                        <label>Address</label>
                                        <input
                                            for="name"
                                            name="address"
                                            type="text"
                                            value={vendorForm.address}

                                            onChange={handleChange}
                                        />


                                    </div>
                                </div>

                                <div class="col-lg-4 col-md-6">
                                    <div class="wrap-box mb-0">
                                        <label>State / Province</label>
                                        <input
                                            for="name"
                                            name="state"
                                            type="text"
                                            value={vendorForm.state}

                                            onChange={handleChange}
                                        />


                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="wrap-box mb-0">
                                        <label>Country</label>
                                        <input
                                            for="name"
                                            name="country"
                                            type="text"
                                            value={vendorForm.country}

                                            onChange={handleChange}
                                        />


                                    </div>
                                </div>

                            </div> */}
                            <form class="choose-file">
                                <div class="inner-file-input">
                                    <h6>Drag & drop any file here</h6>
                                    <input type="file" name="" id="" />
                                    <div class="note-wrap">
                                        <p>
                                            <i class="fa-solid fa-exclamation me-3"></i> Please select a file first!
                                        </p>
                                    </div>
                                </div>
                                <div class="text-areaa">
                                    <textarea name="" id="" cols="30" rows="8" placeholder="Please enter a note here."></textarea>
                                </div>
                                <button type="submit" id="btn-submit">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default Create_Invoice