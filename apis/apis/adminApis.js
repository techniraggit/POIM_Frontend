
import { Axios } from '../config/axiosConfig';

export const fetchProjects = () => {
    return Axios.get(`/api/admin/projects`);
}

export const fetchVendorContact = () => {
    return Axios.get(`/api/helping/vendors-and-contacts`);
}

export const fetchVendorContacts = (id) => {
    return Axios.get(`/api/helping/vendors-and-contacts?vendor_id=${id}`);
}

export const createPO = (data) => {
    Axios.post(`/api/admin/purchase-order`, data);
}

export const fetchProjectSites = () => {
    return Axios.get(`/api/admin/project-sites`);
}

export const getVendorDetails = (id) => {
    return Axios.get(`/api/helping/vendor-details?vendor_contact_id=${id}`)
}

export const getPoList = () => {
    return Axios.get('/api/admin/purchase-order');
}

export const deletePO = (data) => {
    return Axios.delete('/api/admin/purchase-order', { data: data });
}

export const fetchPo = (id) => {
    return Axios.get(`api/admin/purchase-order?po_id=${id}`);
}