import axios from 'axios';
import { base_url } from '@/components/constant';

const Axios = axios.create({
    baseURL: base_url
});

const abortController = new AbortController();

Axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    config.signal = abortController.signal;
    return config;
}, function (error) {
    console.error(error);
    return Promise.reject(error);
});

Axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if(error.response?.data?.code === "token_not_valid") {
        localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
});

export { Axios, abortController };