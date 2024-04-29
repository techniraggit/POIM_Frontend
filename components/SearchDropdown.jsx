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
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if(value) {
      setValid(true);
    }
  }, [value]);

  useEffect(() => {
    const filteredData = filterFunc(data, (typeof searchValue === "undefined" ? value : searchValue) || "", setValid);
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
        className="search-dropdown"
        rules={
          required
            ? [
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((!value && !getFieldValue(name)) || !valid || !clicked) {
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
          className="dropdown-input"
          autoComplete="off"
          disabled={disabled || false}
          value={typeof searchValue === "undefined" ? value : searchValue}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => hideResults(), 200)}
          onChange={(e) => {
            setClicked(false);
            onSearch(e.target.value);
          }}
        />
        <div className={"search-items" + (showResults ? " active" : "")}>
          {showResults &&
            searchResults.map((result) =>
              getMenuItems(result, callback, setSearchValue, hideResults, setClicked)
            )}
        </div>
      </Form.Item>
    </>
  );
};
export default React.memo(SearchDropDown);
