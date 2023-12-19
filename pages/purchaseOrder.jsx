import Header from "@/components/header";
import React from "react";
import DynamicTitle from '@/components/dynamic-title.jsx';
import '../styles/style.css'

const PurchaseOrder = () => {

    return (
        <>
          <DynamicTitle title="Purchase Order" />
          <div className="wrapper-main">
          <div className="inner-wrapper">
            <Header heading='Purchase Orders'/>
                <div className="bottom-wrapp-purchase">
                    <ul className="list-icons">
                        <li className="me-4">
                            <i className="fa-solid fa-plus mb-3"></i>
                            <span>Create PO</span>
                        </li>
                        <li className="me-4">
                            <span className="text-size mb-3">164</span>
                            <span>Create User</span>
                        </li>
                    </ul>
                    <div className="searchbar-wrapper">
                        <div className="Purchase-form">
                            <form className="search-purchase">
                                <input className="vendor-input" placeholder="Search Vendor" />
                                <button className="vendor-search-butt">Search</button>
                            </form>
                            <div className="purchase-filter">
                                <span className="filter-span">Filter :</span>
                                <button className="click-btn"><span>Type</span><i className="fa-solid fa-chevron-down"></i></button>
                                <button className="click-btn"><span>PO Vendor</span><i className="fa-solid fa-chevron-down"></i></button>
                                <button className="click-btn"><span>PO Status</span><i className="fa-solid fa-chevron-down"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="table-wrap vendor-wrap">
                        <h5>Purchase Orders</h5>
                        <div className="inner-table" id="inner-purchase">
                            <table id="purcahse-tablewrap" className="table-hover">
                                <thead>
                                    <tr id="header-row">
                                        <th className="hedaings-tb">S. No</th>
                                        <th className="hedaings-tb">PO No.</th>
                                        <th className="hedaings-tb">Purchase Order Type</th>
                                        <th className="hedaings-tb">PO Creation Date</th>
                                        <th className="hedaings-tb">PO Amount</th>
                                        <th className="hedaings-tb">PO Status</th>
                                        <th className="hedaings-tb">PO Vendor</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>#45488</td>
                                        <td>Material</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Approved</td>
                                        <td>Turner Construction</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>#45488</td>
                                        <td>Material</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Amendments</td>
                                        <td>Pinnacle Builders</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>#45488</td>
                                        <td>Material</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Approved</td>
                                        <td>123 654 987</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>#45488</td>
                                        <td>Subcontractor</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Approved</td>
                                        <td>Aecom</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td>#45488</td>
                                        <td>Rental</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Amendments</td>
                                        <td>Aecom</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>6</td>
                                        <td>#45488</td>
                                        <td>Subcontractor</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Amendments</td>
                                        <td>Pinnacle Builders</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>7</td>
                                        <td>#45488</td>
                                        <td>Rental</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Approved</td>
                                        <td>Pinnacle Builders</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>8</td>
                                        <td>#45488</td>
                                        <td>Rental</td>
                                        <td>16 Sep 2023</td>
                                        <td>$456</td>
                                        <td>Closed</td>
                                        <td>Pinnacle Builders</td>
                                        <td>
                                            <div className="icons-td"><i className="fa-solid fa-eye"></i><i className="fa-solid fa-trash"></i>
                                                <i className="fa-solid fa-pen"></i><i className="fa-solid fa-download"></i>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
          </div>
            
        </>
    )
}
export default PurchaseOrder