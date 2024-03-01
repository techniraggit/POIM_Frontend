import axios from 'axios';
import { base_url } from '@/components/constant';
import { store } from '../../redux/store';
import { SET_LOADING } from '../../redux/store';

const Axios = axios.create({
    baseURL: base_url
});

const abortController = new AbortController();

Axios.interceptors.request.use(function (config) {
    store.dispatch(SET_LOADING(true));
    const token = localStorage.getItem('access_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    config.headers['Timezone'] = timeZone;

    config.signal = abortController.signal;
    return config;
}, function (error) {
    console.error(error);
    store.dispatch(SET_LOADING(false));
    return Promise.reject(error);
});

Axios.interceptors.response.use(function (response) {
    store.dispatch(SET_LOADING(false));
    return response;
}, function (error) {
    if(error.response?.data?.code === "token_not_valid" || error.response?.data?.code==="user_not_found") {
        localStorage.removeItem('access_token');
        window.location.href='/'
    }
    store.dispatch(SET_LOADING(false));
    return Promise.reject(error);
});

export { Axios, abortController };