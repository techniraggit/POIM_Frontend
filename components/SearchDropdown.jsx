import React, { useEffect, useState } from "react";
import "../styles/style.css";
import TextField from "@mui/material/TextField";
import { Form } from "antd";

const SearchDropDown = ({
  value,
  form,
  label,
  name,
  callback,
  data,
  disabled,
  filterFunc,
  getMenuItems,
  required,
  placeholder,
}) => {
  const [searchValue, setSearchValue] = useState(undefined);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const filteredData = filterFunc(data, searchValue || "");
    if(filteredData.length === 0) {
      setValid(false);
    } else {
      setValid(true);
    }
    setSearchResults(filteredData);
  }, [searchValue, data]);

  useEffect(() => {
    form.setFieldsValue({
      [name]: searchValue
        ? searchValue
        : form.getFieldValue(name),
    });
  }, [searchValue]);

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
        rules={
          required
            ? [
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((!value && !getFieldValue(name)) || !valid) {
                      return Promise.reject("Please choose an option");
                    }
                    return Promise.resolve();
                  },
                }),
              ]
            : []
        }
      >
        <TextField
          placeholder={placeholder}
          id="search"
          autoComplete={false}
          disabled={disabled || false}
          value={typeof searchValue === "undefined" ? value : searchValue}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => hideResults(), 200)}
          onChange={(e) => {
            onSearch(e.target.value);
          }}
        />
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {showResults &&
            searchResults.map((result) =>
              getMenuItems(result, callback, setSearchValue, hideResults)
            )}
        </div>
      </Form.Item>
    </>
  );
};
export default React.memo(SearchDropDown);
