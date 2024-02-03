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
                <span class="active-img position-relative">
                  <img src="/images/noun-home-default.svg" alt="" class="me-4 default-img" />
                  <img src="/images/noun-home.svg" alt="" class="img-colored me-4" />
                  Dashboard
                </span>
              </span>
              <RightOutlined className='right-outline' />
              {/* <i className="fa-solid fa-chevron-left"></i> */}
            </Link>

          </li>

          <li className={activeMenuItem === '/user-list' ? 'active' : ''}>
            <Roles action='view_user'>
              <Link href="/user-list">
                <span className="db-span">
                  <span class="active-img position-relative">
                    <img src="/images/user.svg" alt="" className="me-4 default-img" />
                    <img src="/images/user-svg-active.svg" alt="" class="img-colored me-4" />
                    Users
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </Roles>

          </li>
          <li className={activeMenuItem === '/vendor' ? 'active' : ''}>
            <Roles action='view_vendor'>
              <Link href="/vendor">
                <span className="db-span">
                  <span class="active-img position-relative">
                    <img src="/images/vendors.svg" alt="" className="me-4 default-img" />
                    <img src="/images/vendors-colored.svg" alt="" class="img-colored me-4" />
                    Vendors
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </Roles>

          </li>
          <li className={activeMenuItem === '/project' ? 'active' : ''}>
            <Roles action='view_project'>
              <Link href="/project">
                <span className="db-span">
                  <span class="active-img position-relative">
                    <img src="/images/Projects.svg" alt="" className="me-4 default-img" />
                    <img src="/images/Projects-colored.svg" alt="" class="img-colored me-4" />
                    Projects
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </Roles>

          </li>
          <li className={activeMenuItem === '/po_list' ? 'active' : ''}>
            <Roles action='view_purchase_order'>
              <Link href='/po_list'>
                <span className="db-span">
                  <span class="active-img position-relative">
                    <img src="/images/Purchase.svg" alt="" className="me-4 default-img" />
                    <img src="/images/Purchase-colored.svg" alt="" class="img-colored me-4" />
                    Purchase Orders
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </Roles>

          </li>
          <li className={activeMenuItem === '/invoice' ? 'active' : ''}>
            <Link href='/invoice'>
              <span className="db-span">
                <span class="active-img position-relative">
                  <img src="/images/Invoice.svg" alt="" className="me-4 default-img" />
                  <img src="/images/Invoice-colored.svg" alt="" class="img-colored me-4" />
                  Invoice
                </span>
              </span>
              <RightOutlined className='right-outline' />
            </Link>

          </li>
          <li className={activeMenuItem === '/report' ? 'active' : ''}>
            <Link href="#">
              <span className="db-span">
                <span class="active-img position-relative">
                  <img src="/images/Reports.svg" alt="" className="me-4 default-img" />
                  <img src="/images/Invoice-colored.svg" alt="" class="img-colored me-4" />
                  Reports
                </span>
              </span>
              <RightOutlined className='right-outline' />
            </Link>

          </li>
          <li className={activeMenuItem === '/settings' ? 'active' : ''}>
            <Roles action='view_threshold'>
              <Link href='settings'>
                <span className="db-span">
                  <span class="active-img position-relative">
                    <img src="/images/Settings.svg" alt="" className="me-4 default-img" />
                    <img src="/images/Settings-colored.svg" alt="" class="img-colored me-4" />
                    Settings
                  </span>
                </span>
                <RightOutlined className='right-outline' />
              </Link>
            </Roles>
          </li>
        </ul>
      </div>
    </>
  )
}
export default Sidebar;

