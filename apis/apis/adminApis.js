
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
    return Axios.post(`/api/admin/purchase-order`, data);
}
// export const updatePO = (data) => {
//     return Axios.patch(`/api/admin/purchase-order`, data);
// }

export const fetchProjectSites = () => {
    return Axios.get(`/api/admin/project-sites`);
}

export const fetchSiteProject = (project_id) => {
    return Axios.get(`/api/admin/project-sites?project_id=${project_id}`);
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
    return Axios.get(`/api/admin/purchase-order?po_id=${id}`);
}

export const updatePo = (data) => {
    return Axios.patch(`/api/admin/purchase-order`, data);
}
export const threshold=()=>{
    return Axios.get(`/api/admin/threshold`)
}
export const updateThreshold = (data) => {
    return Axios.put(`/api/admin/threshold`, data);
}
export const userSearch=(inputValue)=>{
    return Axios.get(`/api/search/users?query=${inputValue}`)
}
export const userClear=()=>{
    return Axios.get(`/api/admin/users`)
}
export const vendorSearch=(inputValue)=>{
    return Axios.get(`/api/search/vendors?query=${inputValue}`)
}
export const vendorClear=()=>{
    return Axios.get(`/api/admin/vendors`)
}
export const projectSearch=(inputValue)=>{
    return Axios.get(`/api/search/projects?query=${inputValue}`)
}
export const projectClear=()=>{
    return Axios.get(`/api/admin/projects`)
}

export const getPoNumber = () => {
    return Axios.get('/api/admin/po_number');
}

export const fetchVendorDetails = (id) => {
    return Axios.get(`/api/admin/vendors?vendor_id=${id}`);
}

export const updateVendorDetails = (data) => {
    return Axios.patch('/api/admin/vendors', data);
}
export const projectNumber=()=>{
    return Axios.get(`/api/admin/project-number`);
}
export const fetchPoNumbr=()=>{
    return Axios.get(`/api/helping/purchase-orders-list`)
}
export const fetchPoNumbers=(id)=>{
    return Axios.get(`/api/admin/purchase-order?po_id=${id}`)
}
export const invoiceSubmit=(data)=>{
    return Axios.post(`/api/admin/invoice`,data)
}
export const invoiceList=()=>{
    return Axios.get(`/api/admin/invoice`)
}

export const createVendor = (data) => {
    return Axios.post('/api/admin/vendors', data);
}

export const updateVendor = (data) => {
    return Axios.put('/api/admin/vendors', data);
}

export const fetchManagers = () => {
    return Axios.get('/api/helping/project-managers');
}

export const createProject = (data) => {
    return Axios.post('/api/admin/projects', data);
}

export const fetchProjectDetails = (id) => {
    return Axios.get(`/api/admin/projects?project_id=${id}`);
}

export const removeProjectSite = (data) => {
    return Axios.delete('/api/admin/project-sites', {data});
}

export const updateProject = (data) => {
    return Axios.patch('/api/admin/projects', data);
}

export const fetchRoles = () => {
    return Axios.get('/api/admin/roles');
}

export const getUserData = () => {
    return Axios.get('/api/admin/profile');
}

export const changeStatus = (data) => {
    return Axios.put('/api/admin/purchase-order', data);
}

export const updateInvoice = (data) => {
    return Axios.put('/api/admin/invoice', data);
}

export const getInvoiceData = (id) => {
    return Axios.get(`/api/admin/invoice?invoice_id=${id}`);
}
