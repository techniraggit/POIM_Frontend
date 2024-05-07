import MenuItem from '@mui/material/MenuItem';

export const filterVendors = (vendors, searchValue, setValid) => {
    if(vendors?.some((vendor) => vendor.company_name.toLowerCase() === searchValue?.toLowerCase())) {
        setValid(true)
    } else {
        setValid(false)
    }
    return vendors.filter(vendor =>
        vendor.company_name.toLowerCase().includes(searchValue?.toLowerCase())
    );
}

export const getVendorMenuItem = (vendor, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={vendor.vendor_id}
        value={vendor.vendor_id}
        className={vendor.status === 'pending' ? 'light-blue' : ''}
        onClick={() => {
            callback(vendor.vendor_id)
            setSearchValue(vendor.company_name);
            setClicked(true);
            hideResults();
        }}
    >
        {vendor.company_name}
    </MenuItem>
}

export const filterVendorContacts = (contacts, searchValue, setValid) => {
    if(contacts?.some((contact) => contact.name.toLowerCase() === searchValue?.toLowerCase())) {
        setValid(true)
    } else {
        setValid(false)
    }
    return contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue?.toLowerCase())
    );
}

export const getVendorContactMenuItem = (contact, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={contact.vendor_contact_id}
        value={contact.vendor_contact_id}
        onClick={() => {
            callback(contact.vendor_contact_id)
            setSearchValue(contact.name);
            hideResults();
            setClicked(true);
        }}
    >
        {contact.name}
    </MenuItem>
}

export const filterProjects = (projects, searchValue, setValid) => {
    if(projects?.some((project) => String(project.project_no || '')?.toLowerCase() === String(searchValue || '')?.toLowerCase())) {
        setValid(true)
    } else {
        setValid(false)
    }
    return projects.filter(project =>{
        if (project && project.project_no ) {
            const projectNoString = String(project.project_no);
            return projectNoString.includes(searchValue);
        } else {
            console.error("Invalid project or project_no:", project);
            return false;
        }
    }
    );
}

export const getProjectMenuItem = (project, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={project.project_id}
        value={project.project_id}
        onClick={() => {
            callback(project.project_id)
            setSearchValue(project.project_no);
            hideResults();
            setClicked(true);
        }}
    >
        {project.project_no}
    </MenuItem>
}

export const filterSites = (siteOptions, searchValue, setValid) => {
    if(siteOptions?.some((site) => site.address.toLowerCase() === searchValue?.toLowerCase())) {
        setValid(true)
    } else {
        setValid(false)
    }
    return siteOptions.filter(site =>
        site.address.toLowerCase().includes(searchValue?.toLowerCase())
    );
}

export const getSiteMenuItem = (site, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={site.site_id}
        value={site.site_id}
        onClick={() => {
            callback(site.site_id)
            setSearchValue(site.address);
            hideResults();
            setClicked(true);
        }}
    >
        {site.address}
    </MenuItem>
}

export const filterInvoicePO = (poNumber, searchValue, setValid) => {
    if(poNumber?.some((po) => po.po_number.toLowerCase() === searchValue?.toLowerCase())) {
        setValid(true)
    } else {
        setValid(false)
    }
    return poNumber.filter(po =>{
        if (po.po_number) {
            const projectNoString = String(po.po_number);
            return projectNoString.toLowerCase().includes(searchValue?.toLowerCase());
        } else {
            console.error("Invalid project or project_no:", project);
            return false;
        }
    }
    );
}

export const getInvoivePOMenuItem = (number, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={number.po_id}
        value={number.po_id}
        onClick={() => {
            callback(number.po_id)
            setSearchValue(number.po_number);
            hideResults();
            setClicked(true);
        }}
    >
        {number.po_number}
    </MenuItem>
}

export const filterUserRoles = (roles, searchValue) => {
    return roles.filter(role =>
        role.name.toLowerCase().includes(searchValue?.toLowerCase())
    );
}

export const getUserRoleMenuItem = (role, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={role.id}
        value={role.id}
        onClick={() => {
            setClicked(true);
            callback(role.id)
            setSearchValue(role.name);
            hideResults();
        }}
    >
        {role.name}
    </MenuItem>
}


export const filterProjectManager = (managers, searchValue) => {
    return managers.filter(manager =>
        manager.first_name.toLowerCase().includes(searchValue?.toLowerCase())
    );
}

export const getProjectManagerMenuItem = (manager, callback, setSearchValue, hideResults, setClicked) => {
    return <MenuItem
        key={manager.id}
        value={manager.id}
        onClick={() => {
            setClicked(true);
            callback(manager.id)
            setSearchValue(manager.first_name);
            hideResults();
        }}
    >
        {manager.first_name}
    </MenuItem>
}