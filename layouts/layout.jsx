import React from 'react'
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

const Layout = ({ Component, pageProps }) => {
    const loading = useSelector((state) => state.loader?.loading);
  return (
   <Spin spinning={loading}>
     <Component {...pageProps} />
   </Spin>
  )
}

export default Layout;
