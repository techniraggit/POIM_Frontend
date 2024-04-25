import MenuItem from '@mui/material/MenuItem';

export const filterVendors = (vendors, searchValue) => {
    return vendors.filter(vendor =>
        vendor.company_name.toLowerCase().includes(searchValue.toLowerCase())
    );
}

export const getVendorMenuItem = (vendor, callback, setSearchValue, hideResults) => {
    return <MenuItem
    placeholder="nitin"
                key={vendor.vendor_id}
                value={vendor.vendor_id}
                onClick={() => {
                    callback(vendor.vendor_id)
                    setSearchValue(vendor.company_name);
                    hideResults();
                }}
            >
                {vendor.company_name}
        </MenuItem>
}

export const filterVendorContacts = (contacts, searchValue) => {
    return contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue.toLowerCase())
    );
}

export const getVendorContactMenuItem = (contact, callback, setSearchValue, hideResults) => {
    return <MenuItem
                key={contact.vendor_contact_id}
                value={contact.vendor_contact_id}
                onClick={() => {
                    callback(contact.vendor_contact_id)
                    setSearchValue(contact.name); 
                    hideResults();
                }}
            >
                {contact.name}
        </MenuItem>
}