import React, { useEffect, useState } from "react";
import "../styles/style.css";
import TextField from "@mui/material/TextField";
import { Form } from "antd";

const SearchDropDown = ({
  defaultValue,
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
  className
}) => {
  const [searchValue, setSearchValue] = useState(undefined);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [valid, setValid] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if(defaultValue) {
      setValid(true);
      setClicked(true);
    }
    if(defaultValue === "") {
      setSearchValue(undefined);
    }
  }, [defaultValue]);

  useEffect(() => {
    const filteredData = filterFunc(data, (typeof searchValue === "undefined" ? defaultValue : searchValue) || "", setValid);
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
        className={'search-dropdown ' + className}
        rules={
          required
            ? [
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if ((!defaultValue && !getFieldValue(name)) || !valid || !clicked) {
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
          value={typeof searchValue === "undefined" ? defaultValue : searchValue}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => hideResults(), 200)}
          onChange={(e) => {
            setClicked(false);
            onSearch(e.target.value);
          }}
        />
        <div className={"search-items" + (showResults ? " active" : "")}>
          {showResults ?
              searchResults.length > 0 ? searchResults.map((result) =>
              getMenuItems(result, callback, setSearchValue, hideResults, setClicked)
            ) : <>No Records Found</> : <></>
          }
        </div>
      </Form.Item>
    </>
  );
};
export default React.memo(SearchDropDown);
