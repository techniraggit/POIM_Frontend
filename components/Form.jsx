"use client";
import React, { useEffect, useState } from "react";
import "../styles/style.css";
import { Form, Input, Select, DatePicker } from "antd";
import CaretDownOutlined from "@ant-design/icons";
import {
  fetchProjects,
  fetchSiteProject,
  fetchVendorContact,
  fetchVendorContacts,
  getVendorDetails,
} from "@/apis/apis/adminApis";
import moment from "moment";
import SubcontractorRepeator from "./SubcontractorRepeator";
import RentalRepeator from "./rentalRepeator";
import MaterialRepeator from "./materialRepeator";
import { useGlobalContext } from "@/app/Context/UserContext";
import dayjs from "dayjs";
import SearchDropdown from "./SearchDropdown";
import {
  filterProjects,
  filterVendorContacts,
  filterVendors,
  getProjectMenuItem,
  getVendorContactMenuItem,
  getVendorMenuItem,
} from "@/utility/filters";

const { Option } = Select;

function PoForm({
  onChange,
  formData,
  form,
  isNew,
  setFormData,
  edit,
  calculateAmount,
  view,
}) {
  const [contactId, setContactId] = useState("");
  const [projects, setProjects] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    form.setFieldValue("po_type", formData.po_type);
    if (!edit && !view) {
      form.setFieldValue("poDate", dayjs());
    }
    // form.setFieldValue('poDate',formData.po_date);
    if (formData.shipment_type) {
      form.setFieldValue("shipment_type", formData.shipment_type);
    }
    if (
      edit &&
      formData.shipment_type === "project related" &&
      formData.po_type === "material"
    ) {
      formData.material_details.forEach((data, index) => {
        fetchSitesProject(form.getFieldValue("project_id"), index);
      });
    }
    const response = fetchVendorContact({ is_rejected: view || (edit && formData.status !== "pending") });
    response.then((res) => {
      if (res?.data?.status) {
        setVendors([...res.data.vendors]);
        setFormData({
          ...formData,
          po_date: moment().format("YYYY-MM-DD"),
        });
      }
    });
  }, []);

  useEffect(() => {
    if ((edit || view) && formData?.project_id) {
      fetchSitesProject(formData.project_id, 0);
    }
  }, [edit, view, formData.project_id]);

  useEffect(() => {
    if (
      formData &&
      formData.created_by &&
      Object.keys(formData.created_by).length > 0
    ) {
      form.setFieldValue("first_name", formData.created_by.first_name);
      form.setFieldValue("last_name", formData.created_by.last_name);
    } else {
      form.setFieldValue("first_name", user.first_name);
      form.setFieldValue("last_name", user.last_name);
    }
  }, [user]);

  useEffect(() => {
    if (edit && formData.vendor_id) {
      fetchVendorContactDropdown(formData.vendor_id);
    }
  }, [formData.vendor_id, edit]);

  useEffect(() => {
    if (
      form.getFieldValue("shipment_type") === "project related" ||
      form.getFieldValue("shipment_type") === "combined"
    ) {
      const response = fetchProjects({ is_deleted: view || (edit && formData.status !== "pending") });
      response.then((res) => {
        if (res?.data) {
          setProjects(res.data);
        }
      });
    }
  }, [form.getFieldValue("shipment_type")]);

  const fetchSitesProject = (project_id, index) => {
    const response = fetchSiteProject(project_id);
    response.then((res) => {
      if (res?.data?.status) {
        siteOptions[index] = [...res.data.sites];
        setSiteOptions([...siteOptions]);
      }
    });
  };

  const list = (value, index) => {
    if (
      formData.shipment_type === "project related" ||
      formData.shipment_type === "combined"
    ) {
      fetchSitesProject(value, index);
    }
  };

  const fetchVendorContactDropdown = (id, reset) => {
    if (reset) {
      form.setFieldValue("vendor_contact_id", "");
      form.setFieldValue("company_name", "");
      form.setFieldValue("email", "");
      form.setFieldValue("phone", "");
      form.setFieldValue("address", "");
      form.setFieldValue("state", "");
      form.setFieldValue("country", "");
    }
    const response = fetchVendorContacts(id);
    response.then((res) => {
      if (res?.data?.status) {
        formData.company_name = res.data.vendor_company.company_name;
        formData.address = res.data.vendor_company.address;
        formData.state = res.data.vendor_company.state;
        formData.country = res.data.vendor_company.country;
        form.setFieldsValue({
          company_name: res.data.vendor_company.company_name,
        });
        form.setFieldsValue({ address: res.data.vendor_company.address });
        form.setFieldsValue({ state: res.data.vendor_company.state });
        form.setFieldsValue({ country: res.data.vendor_company.country });
        setContactId([...res.data.vendors]);
      }
    });
  };

  const vendorContactDetails = (id) => {
    const response = getVendorDetails(id);
    response.then((res) => {
      if (res.data?.status) {
        formData.email = res.data.vendors.email;
        formData.phone = "+1" + res.data.vendors.phone_number;
        formData.vendor_name = res.data.vendors.name;
        form.setFieldsValue({ email: res.data.vendors.email });
        form.setFieldsValue({ phone: res.data.vendors.phone_number.slice(2) });
        form.setFieldsValue({ vendor_name: res.data.vendors.name });
      }
    });
  };

  return (
    <>
      <div class="order-choose d-flex">
        <div className="left-wrap wrap-number sub-po-typee">
          <Form.Item
            label="Purchase Order Number"
            name="poNumber"
            rules={[
              {
                required: true,
                message: "Please enter Purchase Order Number",
              },
              {
                pattern: /^\d{6,}$/, // Regular expression to ensure at least six digits
                message: "Purchase Order Number must be at least six digits",
              },
            ]}
          >
            <Input
              placeholder="Enter Po Number"
              onChange={({ target: { value } }) => onChange("po_number", value)}
              readOnly={isNew || view}
            />
          </Form.Item>
        </div>

        <div className="left-wrap wrap-number" id="forspce">
          <Form.Item
            label="Date"
            name="poDate"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("Please enter Date");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={isNew || view}
              defaultValue={
                (formData.po_date && dayjs(formData.po_date)) || dayjs()
              }
              onChange={(date) =>
                onChange("po_date", dayjs(date).format("YYYY-MM-DD"))
              }
              placeholder="Select Date"
              suffixIcon={null}
            />
          </Form.Item>
        </div>
      </div>
      <div class="linewrap d-flex" id="w-small">
        <span class="d-block me-0">To</span>
        <hr />
      </div>
      <div class="row vendor-rowgap">
        <div class="col-lg-4 col-md-6">
          <div class="selectwrap react-select" id="vendor-selector">
            <div
              class={`selectwrap ${
                view || (edit && formData.status !== "pending")
                  ? "non-editable-dropdown"
                  : ""
              } shipment-caret select-site aligned-text`}
            >
              <div className="ns-field-set" id="nk-wrapper-id">
                <SearchDropdown
                  placeholder="Select"
                  required={true}
                  defaultValue={vendors?.reduce((value, vendor) => {
                    if (vendor.vendor_id === formData.vendor_id ) {
                      value = vendor.company_name;
                    }
                    return value;
                  }, "")}
                  
                  disabled={view || (edit && formData.status !== "pending")}
                  filterFunc={filterVendors}
                  name="vendor_id"
                  form={form}
                  label="Vendor"
                  callback={(value) => {
                    fetchVendorContactDropdown(value, true);
                    formData.vendor_contact_id = "";
                    onChange("vendor_id", value);
                  }}
                  data={vendors}
                  getMenuItems={getVendorMenuItem}
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div className="ns-field-set" id="nk-wrapper-id">
            <div class="selectwrap react-select" id="vendor-selector">
              <div
                class={`selectwrap ${
                  view || (edit && formData.status !== "pending")
                    ? "non-editable-dropdown"
                    : ""
                } shipment-caret ns-field-set select-site aligned-text`}
              >
                <SearchDropdown
                  placeholder="Select"
                  name="vendor_contact_id"
                  className="select-default"
                  label="Vendor Contact Person"
                  required={false}
                  disabled={view || (edit && formData.status !== "pending")}
                  form={form}
                  defaultValue={
                    contactId.length > 0
                      ? contactId?.reduce((value, contact) => {
                          if (
                            contact.vendor_contact_id ===
                            formData.vendor_contact_id
                          ) {
                            value = contact.name;
                          }
                          return value;
                        }, "")
                      : ""
                  }
                  filterFunc={filterVendorContacts}
                  callback={(value) => {
                    vendorContactDetails(value);
                    onChange("vendor_contact_id", value);
                  }}
                  data={contactId.length > 0 ? contactId : []}
                  getMenuItems={getVendorContactMenuItem}
                />
                {/* <CaretDownOutlined className="nnnn"/> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row space-raw  btm-space">
        <div class="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item
              label="Contact Person Name"
              name="vendor_name"
              class="bold-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter Vendor name",
                },
              ]}
            >
              <Input
                readOnly={view || edit}
                onChange={({ target: { value } }) =>
                  onChange("vendor_name", value)
                }
              />
            </Form.Item>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item
              label="Email"
              name="email"
              class="bold-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter Email",
                },
              ]}
            >
              <Input
                readOnly={view || edit}
                onChange={({ target: { value } }) => onChange("email", value)}
              />
            </Form.Item>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item label="Phone" name="phone" class="bold-label">
              <Input
                addonBefore="+1"
                readOnly={view || edit}
                onChange={({ target: { value } }) => onChange("phone", "+1" + value)}
              />
            </Form.Item>
          </div>
        </div>
        {/* <div class="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item
              label="Company name"
              name="company_name"
              class="bold-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter Company name",
                },
              ]}
            >
              <Input
                disabled
                readOnly={view || edit}
                onChange={({ target: { value } }) =>
                  onChange("company_name", value)
                }
              />
            </Form.Item>
          </div>
        </div> */}
        <div class="col-lg-4 col-md-6">
          <div class="wrap-box mb-0">
            <Form.Item
              label="Address"
              name="address"
              class="bold-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter Company address",
                },
              ]}
            >
              <Input
                disabled
                readOnly={view || edit}
                onChange={({ target: { value } }) => onChange("address", value)}
              />
            </Form.Item>
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="wrap-box mb-0">
            <Form.Item
              label="State / Province"
              name="state"
              class="bold-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter State",
                },
              ]}
            >
              <Input
                disabled
                readOnly={view || edit}
                onChange={({ target: { value } }) => onChange("state", value)}
              />
            </Form.Item>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="wrap-box mb-0">
            <Form.Item
              label="Country"
              name="country"
              class="bold-label"
              rules={[
                {
                  required: true,
                  message: "Please Enter Country",
                },
              ]}
            >
              <Input
                disabled
                readOnly={view || edit}
                onChange={({ target: { value } }) => onChange("country", value)}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div class="linewrap d-flex">
        <span class="d-block me-4">Ship To</span>
        <hr />
      </div>
      <div class="row space-bottom">
        <div class="col-md-6 col-lg-4">
          {/* <div class="selectwrap  shipment-caret aligned-text"> */}
          <div
            class={`selectwrap ${
              view || (edit && formData.status !== "pending")
                ? "non-editable-dropdown"
                : ""
            } shipment-caret  aligned-text`}
          >
            <Form.Item
              label="Shipment Type"
              name="shipment_type"
              for="file"
              class="same-clr"
              rules={[
                {
                  required: true,
                  message: "Please Choose Shipment Type",
                },
              ]}
            >
              <Select
                disabled={view || edit}
                id="single3"
                placeholder="Select"
                class="js-states form-control file-wrap-select"
                onChange={(value) => {
                  onChange("shipment_type", value);
                  if (value === "combined" || value === "non project related") {
                    setSiteOptions([]);
                  }
                }}
              >
                <Option value="project related">Project Related</Option>
                {formData.po_type !== "rental" &&
                  formData.po_type !== "subcontractor" && (
                    <Option value="non project related">
                      Non Project Related
                    </Option>
                  )}
                {formData.po_type !== "rental" &&
                  formData.po_type !== "subcontractor" && (
                    <Option value="combined">Combined</Option>
                  )}
              </Select>
            </Form.Item>
          </div>
        </div>
        {(formData.shipment_type === "project related" ||
          (formData.material_details &&
            formData.material_details?.some(
              (details) => details.material_for === "project"
            ))) && (
          <div className="col-lg-4 col-md-6">
            {/* <div class="selectwrap columns-select shipment-caret"> */}
            <div
              class={`selectwrap ${
                view || (edit && formData.status !== "pending")
                  ? "non-editable-dropdown"
                  : ""
              } shipment-caret  columns-select`}
            >
              <div className="ns-field-set ">
                <SearchDropdown
                  // placeholder={}
                  name="project_id"
                  label="Project"
                  disabled={view || (edit && formData.status !== "pending")}
                  required={true}
                  form={form}
                  filterFunc={filterProjects}
                  defaultValue={
                    Array.isArray(projects)
                      ? projects.reduce((value, project) => {
                          if (formData.project_id === project.project_id) {
                            value = project.project_no;
                          }
                          return value;
                        }, "")
                      : ""
                  }
                  callback={(value) => {
                    formData.material_details.forEach((detail, index) => {
                      formData.material_details[index].project_site_id = "";
                      form.setFieldValue("project_site_id" + index, "");
                    });
                    list(value, 0);
                    onChange("project_id", value);
                  }}
                  data={projects}
                  getMenuItems={getProjectMenuItem}
                />
                <CaretDownOutlined />
              </div>
            </div>
          </div>
        )}
        {formData.shipment_type === "non project related" && (
          <div class="col-md-6 col-lg-4">
            <div class="selectwrap non-project-wrap">
              <Form.Item
                label="Delivery Address"
                name="deliveryAddress"
                for="file"
                class="same-clr"
                rules={[
                  {
                    required: true,
                    message: "Please choose Delivery Address",
                  },
                ]}
                initialValue="1860 Shawson"
              >
                <Input readOnly />
              </Form.Item>
            </div>
          </div>
        )}
      </div>
      <div class="linewrap d-flex">
        <span class="d-block me-4">Details</span>
        <hr />
      </div>
      {formData.po_type === "subcontractor" ? (
        <SubcontractorRepeator
          formData={formData}
          edit={edit}
          siteOptions={siteOptions}
          setFormData={setFormData}
          form={form}
          onChange={onChange}
          view={view}
          calculateAmount={calculateAmount}
        />
      ) : (
        <></>
      )}
      {formData.po_type === "rental" ? (
        <RentalRepeator
          view={view}
          formData={formData}
          edit={edit}
          siteOptions={siteOptions}
          setFormData={setFormData}
          form={form}
          onChange={onChange}
          calculateAmount={calculateAmount}
        />
      ) : (
        <></>
      )}
      {formData.po_type === "material" ? (
        <MaterialRepeator
          formData={formData}
          edit={edit}
          siteOptions={siteOptions}
          list={list}
          projects={projects}
          setFormData={setFormData}
          form={form}
          onChange={onChange}
          view={view}
          calculateAmount={calculateAmount}
        />
      ) : (
        <></>
      )}
      <div className="row top-btm-space mb-0">
        <div className="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item name="hst_amount" label="HST Amount">
              <Input
                addonBefore="$"
                value={formData.hst_amount.toLocaleString()}
                // value={formData.hst_amount ? formData.hst_amount.toLocaleString() : ''}
                readOnly
                placeholder="HST Amount"
              />
            </Form.Item>
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item name="total_amount" label="Total Amount">
              <Input
                addonBefore="$"
                readOnly
                placeholder="Total Amount"
                value={
                  formData.total_amount
                    ? formData.total_amount.toLocaleString()
                    : ""
                }
              />
            </Form.Item>
          </div>
        </div>
        {
          // user.role !== 'admin' &&
          formData.status === "approved" &&
            formData.co_amount > 0 &&
            formData.po_type === "subcontractor" &&
            view && (
              <div className="col-lg-4 col-md-6">
                <div className="wrap-box">
                  <Form.Item name="co_amount" label="CO Amount">
                    <Input
                      addonBefore="$"
                      readOnly
                      // value={coAmount}
                      // onChange={(e) => setCoAmount(e.target.value)}
                      placeholder="CO Amount"
                    />
                  </Form.Item>
                </div>
              </div>
            )
        }
      </div>
      <div class="linewrap d-flex">
        <span class="d-block me-2">By Details</span>
        <hr />
      </div>
      <div className="row">
        <div class="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please enter First Name" }]}
            >
              <Input readOnly placeholder="First Name" />
            </Form.Item>
          </div>
        </div>
        <div class="col-lg-4 col-md-6">
          <div class="wrap-box">
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please enter Last Name" }]}
            >
              <Input readOnly placeholder="Last Name" />
            </Form.Item>
          </div>
        </div>
      </div>
    </>
  );
}
export default PoForm;
