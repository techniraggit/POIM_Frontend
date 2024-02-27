import React, { useEffect, useState } from 'react';
import '../styles/style.css'
import Link from 'next/link';
import { RightOutlined, HomeFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Roles from './Roles';

const Sidebar = () => {
  const router = useRouter();
  const [initialVisit, setInitialVisit] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('');
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const access_refresh = localStorage.getItem('refresh_token');

    if (!initialVisit && access_token === null && access_refresh === null) {
      router.push('/');
    } else {
      setInitialVisit(false);
    }
  }, [initialVisit]);

  useEffect(() => {
    setActiveMenuItem(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <div className="aside-dashboard">
        <div className="logo">
          <a href="#"><img src="/images/logo.png" alt="" /></a>
        </div>
        <ul className="list-dboard">
          <li className={activeMenuItem === '/dashboard' ? 'active' : ''}>
            <Link href="/dashboard">
              <span className="db-span">
                {/* <HomeFilled className='home-sidebar me-4' /> */}
                <span className="active-img position-relative">
                  <img src="/images/noun-home-default.svg" alt="" className="me-4 default-img" />
                  <img src="/images/noun-home.svg" alt="" className="img-colored me-4" />
                  Dashboard
                </span>
              </span>
              <RightOutlined className='right-outline' />
              {/* <i className="fa-solid fa-chevron-left"></i> */}
            </Link>

          </li>

          <Roles action='view_user'>
            <li className={activeMenuItem === '/user-list' ? 'active' : ''}>
              <Link href="/user-list">
                <span className="db-span">
                  <span className="active-img position-relative">
                    <img src="/images/user.svg" alt="" className="me-4 default-img" />
                    <img src="/images/user-svg-active.svg" alt="" className="img-colored me-4" />
                    Users
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </li>
          </Roles>

          <Roles action='view_vendor'>
            <li className={activeMenuItem === '/vendor' ? 'active' : ''}>
              <Link href="/vendor">
                <span className="db-span">
                  <span className="active-img position-relative">
                    <img src="/images/vendors.svg" alt="" className="me-4 default-img" />
                    <img src="/images/vendors-colored.svg" alt="" className="img-colored me-4" />
                    Vendors
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </li>
          </Roles>

          <Roles action='view_project'>
            <li className={activeMenuItem === '/project' ? 'active' : ''}>
              <Link href="/project">
                <span className="db-span">
                  <span className="active-img position-relative">
                    <img src="/images/Projects.svg" alt="" className="me-4 default-img" />
                    <img src="/images/Projects-colored.svg" alt="" className="img-colored me-4" />
                    Projects
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </li>
          </Roles>

          <Roles action='view_purchase_order'>
            <li className={activeMenuItem === '/po_list' ? 'active' : ''}>
              <Link href='/po_list'>
                <span className="db-span">
                  <span className="active-img position-relative">
                    <img src="/images/Purchase.svg" alt="" className="me-4 default-img" />
                    <img src="/images/Purchase-colored.svg" alt="" className="img-colored me-4" />
                    Purchase Orders
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </li>
          </Roles>

          <li className={activeMenuItem === '/invoice' ? 'active' : ''}>
            <Link href='/invoice'>
              <span className="db-span">
                <span className="active-img position-relative">
                  <img src="/images/Invoice.svg" alt="" className="me-4 default-img" />
                  <img src="/images/Invoice-colored.svg" alt="" className="img-colored me-4" />
                  Invoice
                </span>
              </span>
              <RightOutlined className='right-outline' />
            </Link>

          </li>
          <li className={activeMenuItem === '/po-report' || activeMenuItem === '/user-report' || activeMenuItem === '/invoice-report' || activeMenuItem === '/subcontrator-report' ? 'active' : ''} id='report-li'>
            <Link href="/po-report">
              <span className="db-span">
                <span className="active-img position-relative">
                  <img src="/images/report-icon.svg" alt="" className="me-4 default-img" />
                  <img src="/images/report-colored.svg" alt="" className="img-colored me-4" />
                  Reports
                </span>
              </span>
              <RightOutlined className='right-outline' />
            </Link>
            <ul className="reports-dropdown" style={{display: activeMenuItem === '/po-report' || activeMenuItem === '/user-report' || activeMenuItem === '/invoice-report' || activeMenuItem === '/subcontrator-report' ? 'block' : 'none'}}>
              <li>
                <Link href="/po-report">
                  <span className="db-span">
                    <span className={`active-img position-relative ${activeMenuItem === '/po-report' ? 'active' : ''}`}>
                      <img src="/images/Reports.svg" alt="" className="me-4 default-img" />
                      <img src="/images/Invoice-colored.svg" alt="" className="img-colored me-4 d-none" />
                      PO Report
                    </span>
                  </span>
                  <RightOutlined className='right-outline' />
                </Link>
              </li>
              <li>
                <Link href="/subcontrator-report">
                  <span className="db-span">
                    <span className={`active-img position-relative ${activeMenuItem === '/subcontrator-report' ? 'active' : ''}`}>
                      <img src="/images/Reports.svg" alt="" className="me-4 default-img" />
                      <img src="/images/Invoice-colored.svg" alt="" className="img-colored me-4 d-none" />
                      Subcontractor Report
                    </span>
                  </span>
                  <RightOutlined className='right-outline' />
                </Link>
              </li>
              <li>
                <Link href="/invoice-report">
                  <span className="db-span">
                    <span className={`active-img position-relative ${activeMenuItem === '/invoice-report' ? 'active' : ''}`}>
                      <img src="/images/Reports.svg" alt="" className="me-4 default-img" />
                      <img src="/images/Invoice-colored.svg" alt="" className="img-colored me-4 d-none" />
                      Invoice Report
                    </span>
                  </span>
                  <RightOutlined className='right-outline' />
                </Link>
              </li>
              <li>
                <Link href="/user-report">
                  <span className="db-span">
                    <span className={`active-img position-relative ${activeMenuItem === '/user-report' ? 'active' : ''}`}>
                      <img src="/images/Reports.svg" alt="" className="me-4 default-img" />
                      <img src="/images/Invoice-colored.svg" alt="" className="img-colored me-4 d-none" />
                      User Report
                    </span>
                  </span>
                  <RightOutlined className='right-outline' />
                </Link>
              </li>
            </ul>

          </li>
          <Roles action='view_threshold'>
            <li className={activeMenuItem === '/settings' ? 'active' : ''}>
              <Link href='settings'>
                <span className="db-span">
                  <span className="active-img position-relative">
                    <img src="/images/Settings.svg" alt="" className="me-4 default-img" />
                    <img src="/images/Settings-colored.svg" alt="" className="img-colored me-4" />
                    Settings
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </li>
          </Roles>
        </ul>
      </div>
    </>
  )
}

export default Sidebar;