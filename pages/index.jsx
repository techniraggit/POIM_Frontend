'use client'
import React, { useEffect, useState } from "react";
import '../styles/style.css'
import axios from 'axios';
import { getServerSideProps } from "@/components/mainVariable";
import '../styles/popup.css';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { isLoggedIn } from "@/apis/apis/shared";
import { useGlobalContext } from "@/app/Context/UserContext";

const Login = ({ base_url }) => {
    const [email, setEmail] = useState('');
    const [forgotEmail, setforgotEmail] = useState('')
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { setUser } = useGlobalContext();
    const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
    const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});

    const router = useRouter();

    useEffect(() => {
        if(isLoggedIn()) {
            router.push('/dashboard');
        }
    }, [])

    const validateForm = () => {
        const errors = {};

        if (!email) {
            errors.email = 'Please enter your email address';
        }

        if (!password) {
            errors.password = 'Please enter your password';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const validateForgotPasswordForm = () => {
        const errors = {};

        if (!forgotEmail) {
            errors.forgotEmail = 'Please enter your email address';
        }

        setForgotPasswordErrors(errors);

        return Object.keys(errors).length === 0;
    };


    const handleForgotPassword = () => {
        setShowForgotPasswordPopup(true);
    };

    const handlePopupClose = () => {
        setShowForgotPasswordPopup(false);
    };

    const handleSendEmail = async () => {
        if (validateForgotPasswordForm()) {
            handlePopupClose();
            axios.post(`${base_url}/api/accounts/forget-password`, { email: forgotEmail })
            .then((response) => {
                if(response?.data?.status) {
                    message.success(response.data?.message);
                }
                setforgotEmail('');
            })
            .catch((error) => {
                setforgotEmail('');
                message.error(error?.response?.data?.message)
            })
        } else {
            console.log('Forgot Password form validation failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const values = {
                email: email,
                password: password,
            }
            try {
                const response = await axios.post(`${base_url}/api/accounts/login`, values
                );
                if (response.status === 200) {
                    localStorage.setItem('access_token', response.data.access_token)
                    localStorage.setItem('refresh_token', response.data.refresh_token)
                    setUser({
                        first_name: response.data.user_first_name,
                        last_name: response.data.user_last_name,
                        permissions: response.data.user_permissions,
                        role: response.data.user_role
                    });
                    router.push('/dashboard');
                    message.success('Login successful');
                } else {
                }
            } catch (error) {
                message.error(error?.response?.data?.message);
            }
        } else {
        }
    };

    return (
        <>
            <section className="dashboard-wrap">
                <div className="container">
                    <div className="login-board">
                        <div className="logowrap">
                            <img src="/images/logo.png" alt="" />
                            <h4 className="admin">Admin Login</h4>
                            <form action="#" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        {errors.email && <span className="error">{errors.email}</span>}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {errors.password && <span className="error">{errors.password}</span>}
                                </div>
                                <div className="col-md-12 chekbox-wrap">

                                    <div ><a href="javascript:void(0)"><span onClick={handleForgotPassword}>Forgot Password?</span></a></div>

                                    {showForgotPasswordPopup && (
                                        <div className="forgot-password-popup forgot-popup-custom">
                                            <div className="popup-content">
                                                <span className="close-popup" onClick={handlePopupClose}>
                                                    &times;
                                                </span>
                                                <h2>Forgot Password</h2>
                                                <input
                                                    type="email"
                                                    name="forgotEmail"
                                                    placeholder="Enter your email"
                                                    value={forgotEmail}
                                                    onChange={(e) => setforgotEmail(e.target.value)}
                                                />
                                                {forgotPasswordErrors.forgotEmail && (
                                                    <span className="error">{forgotPasswordErrors.forgotEmail}</span>
                                                )}
                                                <button className="sendemail-btn" onClick={handleSendEmail}>Send Email</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="submit-btn">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export { getServerSideProps };
export default Login;