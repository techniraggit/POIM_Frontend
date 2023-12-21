import React from 'react';
import '../styles/style.css'
import Link from 'next/link';
import { RightOutlined } from '@ant-design/icons';

const Sidebar = () => {
  return (
    <>
      <div className="aside-dashboard">
        <div className="logo">
          <a href="#"><img src="/images/logo.png" alt="" /></a>
        </div>
        <ul className="list-dboard">
          <li>
            <Link href="/dashboard">
              <span className="db-span">
                <i className="fa-solid fa-house arrow-clr me-4"></i>Dashboard
              </span>
              <RightOutlined className='right-outline' />
              {/* <i className="fa-solid fa-chevron-left"></i> */}
            </Link>
           
          </li>

          <li>
            <Link href="/user-list">
              <span className="db-span">
                <img src="/images/user.svg" alt="" className="me-4" />
                Users
              </span>
              <RightOutlined className='right-outline' />
            </Link>
            
          </li>
          <li>
            <Link href="/vendor">
              <span className="db-span">
                <img src="/images/vendors.svg" alt="" className="me-4" />
                Vendors
              </span>
              <RightOutlined className='right-outline' />
            </Link>
           
          </li>
          <li>
          <Link href="/project">
          <span className="db-span">
                <img src="/images/Projects.svg" alt="" className="me-4" />
                Projects
              </span>
              <RightOutlined className='right-outline' />
          </Link>
            
          </li>
          <li>
            <Link href='/po_list'>
            <span className="db-span">
                <img src="/images/Purchase.svg" alt="" className="me-4" />
                Purchase Orders
              </span>
              <RightOutlined className='right-outline' />
            </Link>
           
          </li>
          <li>
            <Link href='/invoice'>
            <span className="db-span">
                <img src="/images/Invoice.svg" alt="" className="me-4" />
                Invoice
              </span>
              <RightOutlined className='right-outline' />
            </Link>
            
          </li>
          <li>
            <Link href="#">
            <span className="db-span">
                <img src="/images/Reports.svg" alt="" className="me-4" />
                Reports
              </span>
              <RightOutlined className='right-outline' />
            </Link>
           
          </li>
          <li>
            <Link href='#'>
            <span className="db-span">
                <img src="/images/Settings.svg" alt="" className="me-4" />
                Settings
              </span>
              <RightOutlined className='right-outline' />
            </Link>
           
           
          </li>
        </ul>
      </div>
    </>
  )
}
export default Sidebar

