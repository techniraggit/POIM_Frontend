import React, { useEffect, useState } from "react";
import { Button, Select } from 'antd';
import { fetchVendorContact, searchUserRoles, searchPoName, fetchProjects } from "@/apis/apis/adminApis";
const { Option } = Select;

const Filters = ({ search, name, toDate, fromDate, role, type, status, vendor, project_number, download, applyFilters, currentPage, downloadPdf }) => {
    const [inputValue, setInputValue] = useState('');
    const [companyName, setCompanyName] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [projects, setProjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [poName, setPoName] = useState([]);
    const [query, setQuery] = useState({
        filter_by_po_type: "",
        filter_by_po_vendor: "",
        filter_by_po_status: "",
        filter_by_project_number: "",
        filter_by_role: "",
        filter_by_name: "",
        to_date: "",
        from_date: ''
    });

    useEffect(() => {
        if (vendor) {
            const response = fetchVendorContact();
            response.then((res) => {
                setCompanyName([...res.data.vendors])
            })
        }
    }, [vendor]);

    useEffect(() => {
        if (role) {
            const response = searchUserRoles()
            response.then((res) => {
                setRoleName(res.data.roles)
            })
        }
    }, [role])


    useEffect(() => {
        if (project_number) {
            const response = fetchProjects()
            response.then((res) => {
                if (res?.data) {
                    setProjects(res.data);
                }
            })
        }
    }, [project_number])


    useEffect(() => {
        if (name) {
            const response = searchPoName()
            response.then((res) => {
                setPoName(res.data.po_creators)

            })

        }

    }, [name])



    useEffect(() => {
        if (query && !Object.keys(query).some(data => query[data] !== "") && inputValue === '') {
            applyFilters({})
        } else {
            applyFilters({
                ...query,
                query: inputValue,
                page: currentPage
            });
        }
    }, [currentPage])

    const handleClearFilter = () => {
        setQuery({
            filter_by_po_type: "",
            filter_by_po_vendor: "",
            filter_by_po_status: "",
            filter_by_project_number: "",
            filter_by_name: "",  // By creator name
            filter_by_role: "",
            to_date: "",
            from_date: ''
        })
        setInputValue('');
        applyFilters({});
    }
    return (
        <div className="filter-wrapper">
            <div className="filter-main">
                <div className="wrapin-form add-clear-wrap mt-0 ps-3">
                    {search && <input className="vendor-input" placeholder="Search"
                        value={inputValue} onChange={(event) => setInputValue(event.target.value)}
                    />}


                    {fromDate && (
                        <div className="date-wrapp me-1">
                            <label htmlFor="">{query.from_date || "From Date"}</label>
                            <input
                                type="date"
                                className="input-date"
                                placeholder=""
                                onChange={(event) => {
                                    const selectedDate = event.target.value;
                                    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                                    if (query.to_date && selectedDate > query.to_date) {
                                        setErrorMessage("From date cannot be greater than to date");
                                        return;
                                    }
                                    setErrorMessage("");
                                    setQuery(prevState => ({
                                        ...prevState,
                                        from_date: formattedDate
                                    }));
                                }}
                                value={query['from_date']}
                            />
                        </div>
                    )}


                    {/* {fromDate && <div class="date-wrapp me-1"> <label for="">{query.from_date || "From Date"}</label>
                    <input type="date" class="input-date" placeholder=""
                        onChange={(event) => {
                            const selectedDate = event.target.value;
                            setQuery(prevState => ({
                                ...prevState,
                                from_date: selectedDate
                            }));
                        }}

                        value={query['from_date']}
                    />
                </div>} */}

                    <div>
                        {toDate && (
                            <div className="date-wrapp me-1">
                                <label htmlFor="">{query.to_date || "To Date"}</label>
                                <input
                                    type="date"
                                    className="input-date"
                                    placeholder=""
                                    onChange={(event) => {
                                        const selectedDate = event.target.value;
                                        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                                        if (query.from_date && selectedDate < query.from_date) {
                                            setErrorMessage("To date cannot be smaller than from date");
                                            return;
                                        }
                                        setErrorMessage("");
                                        setQuery(prevState => ({
                                            ...prevState,
                                            to_date: formattedDate
                                        }));
                                    }}
                                    value={query['to_date']}
                                />
                            </div>
                        )}
                        {errorMessage && (
                            <div className="error">{errorMessage}</div>
                        )}
                    </div>
                    {/* {toDate && <div class="date-wrapp me-1"> <label for="">{query.to_date || "To Date"}</label>
                    <input type="date" class="input-date" placeholder=""
                        onChange={(event) => {
                            const selectedDate = event.target.value;
                            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                            setQuery(prevState => ({
                                ...prevState,
                                to_date: formattedDate
                            }));
                        }}

                        value={query['to_date']}
                    />
                </div>} */}
                    {role && <Select className="line-select dropdown-report me-2" placeholder="Role"
                        onChange={(value) =>
                            setQuery(prevState => ({
                                ...prevState,
                                ['filter_by_role']: value
                            }))}
                        value={query['filter_by_role'] || "Role"}
                    >
                        {roleName.map((entry) =>

                        (
                            <Select.Option key={entry.name} value={entry.name}>
                                {entry.name}
                            </Select.Option>
                        )
                        )}

                    </Select>}

                    {name && <Select className="line-select dropdown-report me-2" placeholder="Name"
                        onChange={(value) =>
                            setQuery(prevState => ({
                                ...prevState,
                                ['filter_by_name']: value
                            }))}
                        value={query['filter_by_name'] || "PO Creator"}
                    >
                        {poName.map((entry) =>
                        (
                            <Select.Option key={entry.created_by__id} value={entry.created_by__id}>
                                {entry.full_name}
                            </Select.Option>
                        )
                        )}

                    </Select>}

                    {type && <Select placeholder=" Type" id="single1"
                        className="line-select me-2"
                        value={query['filter_by_po_type'] || "PO Type"}
                        onChange={(value) =>
                            setQuery(prevState => ({
                                ...prevState,
                                ['filter_by_po_type']: value
                            }))
                        }
                    >
                        <Option value="material">Material PO</Option>
                        <Option value="rental">Rental PO</Option>
                        <Option value="subcontractor">Sub Contractor PO</Option>
                    </Select>}
                    {vendor && <Select className="line-select dropdown-report me-2" placeholder="PO Vendor"
                        onChange={(value) =>
                            setQuery(prevState => ({
                                ...prevState,
                                ['filter_by_po_vendor']: value
                            }))}
                        value={query['filter_by_po_vendor'] || "PO Vendor"}
                    >
                        {companyName.map((entry) =>
                        (
                            <Select.Option key={entry.vendor_id} value={entry.vendorId}>
                                {entry.company_name}
                            </Select.Option>
                        )
                        )}
                    </Select>}


                    {project_number && <Select className="line-select dropdown-report me-2" placeholder="Role"
                        onChange={(value) =>
                            setQuery(prevState => ({
                                ...prevState,
                                ['filter_by_project_number']: value
                            }))}
                        value={query['filter_by_project_number'] || "Project No."}
                    >
                        {projects.map((project) =>
                        (
                            <Select.Option key={project.project_no} value={project.project_no}
                            >
                                {project.project_no}
                            </Select.Option>
                        )
                        )}

                    </Select>}



                    {status && <Select className="line-select  me-2" placeholder="PO Status"
                        onChange={(value) =>
                            setQuery(prevState => ({
                                ...prevState,
                                ['filter_by_po_status']: value
                            }))}
                        value={query['filter_by_po_status'] || "PO Status"}
                    >
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>}
                    <button type="button" className="clear-button ms-3" onClick={() => {
                        applyFilters({
                            ...query,
                            query: inputValue,
                            page: currentPage
                        });
                    }}
                    >
                        Apply
                    </button>
                    <button type="button" className="clear-button ms-3" onClick={handleClearFilter}
                    >
                        Clear
                    </button>
                    {download && <Button type="submit" class="export-btn" id="xls-btn" onClick={() => {
                        downloadPdf({
                            ...query,
                            query: inputValue
                        })
                    }}>Export To XLS</Button>}
                </div>
            </div>
        </div>
    )
}

export default Filters;