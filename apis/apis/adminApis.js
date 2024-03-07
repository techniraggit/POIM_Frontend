
import { Axios } from '../config/axiosConfig';

export const fetchProjects = () => {
    return Axios.get(`/api/admin/projects`);
    // ?page=${currentPage}
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
export const fetchProjectSites = () => {
    return Axios.get(`/api/admin/project-sites`);
}

export const fetchSiteProject = (project_id) => {
    return Axios.get(`/api/admin/project-sites?project_id=${project_id}`);
}

export const getVendorDetails = (id) => {
    return Axios.get(`/api/helping/vendor-details?vendor_contact_id=${id}`)
}

export const getPoList = (currentPage) => {
    return Axios.get(`/api/admin/purchase-order?page=${currentPage}`);
}
export const clearPoList = () => {
    return Axios.get(`/api/admin/purchase-order`);
}
export const allRead=()=>{
    return Axios.get('/api/admin/mark_all_as_read')
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
export const vendorSearch=(params)=>{
    return Axios.get(`/api/search/vendors?${params}`)
}
export const poSearch=(inputValue)=>{
    return Axios.get(`/api/search/purchase-order?query=${inputValue}`)
}
export const invoiceSearch=(inputValue)=>{
    return Axios.get(`/api/search/invoices?query=${inputValue}`)
}
export const filterSearch=(params)=>{
    return Axios.get(`/api/search/invoices?${params}`)
}

export const userFilterSearch=(params)=>{
    return Axios.get(`/api/search/users?${params}`)
}
export const searchUserRoles=(params)=>{
    return Axios.get(`/api/helping/get-roles-list?${params}`)
}
export const searchPoName=(params)=>{
    return Axios.get(`/api/helping/get-po-creators-list?${params}`)
}
export const filterSearchPo=(params)=>{
    return Axios.get(`/api/search/purchase-order?${params}`)
}
export const vendorClear=()=>{
    return Axios.get(`/api/admin/vendors`)
}
export const projectSearch=(params)=>{
    return Axios.get(`/api/search/projects?${params}`)
}
export const getProjectList = (page) => {
    return Axios.get(`/api/admin/projects?page=${page}`)
}

export const getPoNumber = () => {
    return Axios.get('/api/admin/po_number');
}
export const getNotification=()=>{
    return Axios.get(`/api/admin/notifications`)
}
export const getCount=()=>{
    return Axios.get(`/api/helping/get-count`)
}
export const toggleButton=(data)=>{
    return Axios.put('/api/admin/notifications', data);
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
export const fetchPoNumbr=(type)=>{
    return Axios.get(`/api/helping/purchase-orders-list?po_type=${type}`)
}
export const fetchPoNumbers=(id)=>{
    return Axios.get(`/api/admin/purchase-order?po_id=${id}`)
}
export const fetchProjectNumber=(number)=>{
    return Axios.get(`/api/helping/is-registered-project-number?project_number=${number}`)
}
export const invoiceSubmit=(data)=>{
    return Axios.post(`/api/admin/invoice`,data)
}
export const invoiceList=(currentPage)=>{
    return Axios.get(`/api/admin/invoice?page=${currentPage}`)
}
export const userList=(currentPage)=>{
    return Axios.get(`/api/admin/users?page=${currentPage}`)
}
export const invoiceClear=()=>{
    return Axios.get(`/api/admin/invoice`)
}

export const createVendor = (data) => {
    return Axios.post('/api/admin/vendors', data);
}

export const updateVendor = (data) => {
    return Axios.put('/api/admin/vendors', data);
}
export const updatematerialPo = (data) => {
    return Axios.patch('/api/admin/remove-material', data);
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

export const changeInvoiceStatus = (data) => {
    return Axios.put('/api/admin/invoice', data);
}

export const updateInvoice = (data) => {
    return Axios.patch('/api/admin/invoice', data);
}

export const getInvoiceData = (id) => {
    return Axios.get(`/api/admin/invoice?invoice_id=${id}`);
}

export const downloadInvoice = (id) => {
    return Axios.get(`/api/admin/invoice-download?file_id=${id}`, {responseType: 'blob'});
}

export const removeInvoiceFile = (data) => {
    return Axios.put('/api/admin/invoice-remove', data);
}

export const profileSave = (data) => {
    return Axios.post(`/api/accounts/change-password`, data);
}

export const poReport=(params)=>{
    return Axios.get(`/api/analytic/purchase_order_reports?${params}`, {responseType: 'blob'})
}

export const invoiceReportPdf = (params) =>{
    return Axios.get(`/api/analytic/invoice_reports?${params}`, {responseType: 'blob'})
}

export const userReportPdf = (params) =>{
    return Axios.get(`/api/analytic/user_reports?${params}`, {responseType: 'blob'})
}

export const downloadSubcontractorReport = (params) => {
    return Axios.get(`/api/analytic/subcontractor_reports?${params}`, {responseType: 'blob'})
}

export const getSubcontractorReport = (params) => {
    return Axios.get(`/api/admin/subcontractor-view?${params}`);
}

export const getVendorList = (page) => {
    return Axios.get(`/api/admin/vendors?page=${page}`);
}

export const uploadContract = (data) => {
    return Axios.post('/api/admin/upload-contract', data);
}

export const downloadContract = (data) => {
    return Axios.get('/api/admin/upload-contract?po_id=' + data.id + '&contract_id=' + data.contract_id, {responseType: 'blob'});
}

export const changeVendorStatus = (data) => {
    return Axios.put('/api/admin/approve_vendor', data);
}