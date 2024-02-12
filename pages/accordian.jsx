import React from 'react';
import '../styles/style.css'
import { Collapse } from 'antd';


const text_1 = 
    (<div className="bottom-po">
    <div className="top-data">
      {/* First entry */}
      <div className="dot-wrap">
        <div className="form-dot"><span></span></div>
        <div className="row left-wrap-space">
          <div className="col-lg-3 col-md-6">
            <div className="inner-data">
              <span className="small-span">Created On</span>
              <span className="medium-span">18 Oct 2023</span>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="inner-data">
              <span className="small-span">Created By</span>
              <span className="medium-span">Darell ( Supervisor)</span>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="inner-data">
              <span className="small-span">Status Of Approval</span>
              {/* <span className="medium-span">Darell ( Supervisor)</span> */}
            </div>
          </div>
        </div>
      </div>
      <div className="linewrap d-flex space-raw">
        <span className="d-block me-2">Material</span>
        <hr />
      </div>
      <div className="row raw-data-btm">
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Quantity</span>
            <span className="medium-span">200</span>
          </div>
        </div>
        <div className="col-lg-5 col-md-8">
          <div className="inner-data">
            <span className="small-span">Description</span>
            <span className="medium-span">Aggregated Concrete Bricks</span>
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Unit Price</span>
            <span className="medium-span">$12</span>
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Amount</span>
            <span className="medium-span">$2400</span>
          </div>
        </div>
      </div>
    </div>
    {/* Second entry */}
    <div className="top-data">
      <div className="dot-wrap">
        <div className="form-dot"><span></span></div>
        <div className="row left-wrap-space">
          <div className="col-lg-3 col-md-3">
            <div className="inner-data">
              <span className="small-span">Amendment 01</span>
              <span className="medium-span">19 Oct 2023</span>
            </div>
          </div>
          <div className="col-lg-4 col-md-8">
            <div className="inner-data">
              <span className="small-span">Amendment By</span>
              <span className="medium-span">Darell ( Supervisor)</span>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="inner-data">
              <span className="small-span">Status Of Approval</span>
              <span className="medium-span pending-text">Pending</span>
            </div>
          </div>
        </div>
      </div>
      <div className="linewrap d-flex space-raw">
        <span className="d-block me-2">Material</span>
        <hr />
      </div>
      <div className="row">
        {/* Third entry */}
        <div className="4">
          <div className="inner-data">
            <span className="small-span">Quantity</span>
            <span className="medium-span">200</span>
          </div>
        </div>
        <div className="col-lg-5 col-md-8">
          <div className="inner-data">
            <span className="small-span">Description</span>
            <span className="medium-span">Aggregated Concrete Bricks</span>
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Unit Price</span>
            <span className="medium-span">$12</span>
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Amount</span>
            <span className="medium-span">$2400</span>
          </div>
        </div>
      </div>
      {/* Fourth entry */}
      <div className="row space-raw">
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Quantity</span>
            <span className="medium-span">200</span>
          </div>
        </div>
        <div className="col-lg-5 col-md-8">
          <div className="inner-data">
            <span className="small-span">Description</span>
            <span className="medium-span">Aggregated Concrete Bricks</span>
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Unit Price</span>
            <span className="medium-span">$12</span>
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="inner-data">
            <span className="small-span">Amount</span>
            <span className="medium-span">$2400</span>
          </div>
        </div>
      </div>
    </div>
  </div>);


const items = [
  {
    key: '1',
    label: 'Amendments',
    children: text_1
  },
  {
    key: '2',
    label: 'Amendments',
    children: text_1

  },
  {
    key: '3',
    label: 'Amendments',
    children: text_1

  },
];
const App = () => {
  const onChange = (key) => {
    console.log(key);
  };
  return <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />;
};
export default App;