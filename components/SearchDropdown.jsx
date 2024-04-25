import React, { useEffect, useState } from "react";
import '../styles/style.css'
import TextField from '@mui/material/TextField';
import { Form } from "antd";

<<<<<<< HEAD
const SearchDropDown = ({ form, label, name, callback, data, filterFunc, getMenuItems, required, placeholder }) => {
=======
const SearchDropDown = ({ form, label, name, callback, data, disabled, filterFunc, getMenuItems, required }) => {
>>>>>>> f8ad13d303599eb199e185439504eac42f4bb3bf
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    useEffect(() => {
        const filteredData = filterFunc(data, searchValue);
        setSearchResults(filteredData);
    }, [searchValue, data]);

    const onSearch = (value) => {
        setSearchValue(value);
        setShowResults(true);
    };

    const hideResults = () => {
        setShowResults(false);
    };

    return (
        <>
            <Form.Item
                label={label}
                name={name}
                disabled={disabled}
               
                rules={required ? [
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value && !getFieldValue(name)) {
                                return Promise.reject('Please choose an option');
                            }
                            return Promise.resolve();
                        },
                    }),
                ] : []}
            >
                <TextField
                    placeholder={placeholder}
                    id="search"
                    value={searchValue}
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setTimeout(() => hideResults(), 200)}
                    onChange={(e) => {
                        onSearch(e.target.value);
                        form.setFieldsValue({ [name]: e.target.value ? null : form.getFieldValue(name) });
                    }}
                />
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {showResults && searchResults.map((result) => (
                        getMenuItems(result, callback, setSearchValue, hideResults)
                    ))}
                </div>
            </Form.Item>

        </>
    )

}
export default React.memo(SearchDropDown);