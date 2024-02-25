import { getCount } from '@/apis/apis/adminApis';
import React, { useEffect, useState } from 'react';

const ReportHeader = () => {
  const [count, setCount] = useState({
    users: 0,
    vendores: 0,
    projects: 0,
    pos: 0,
    invoices: 0
  });

  useEffect(() => {
    const response = getCount();
    response.then((res) => {
        if(res?.status === 200) {
            const data = res.data;
            setCount({
                users: data.total_users,
                vendores: data.total_vendors,
                projects: data.total_projects,
                pos: data.total_po,
                invoices: data.total_invoices
            });
        }
    })
  }, []);

  return (
    <ul class="list-icons text-list-icons">
        <li class="me-4">
            <span class="text-size mb-3">{count?.users || 0}</span>
            <span>Total Users</span>
        </li>
        <li class="me-4">
            <span class="text-size mb-3">{count?.vendores || 0}</span>
            <span>Total Vendors</span>
        </li>
        <li class="me-4">
            <span class="text-size mb-3">{count?.projects || 0}</span>
            <span>Total Projects</span>
        </li>
        <li class="me-4">
            <span class="text-size mb-3">{count?.pos || 0}</span>
            <span>Total PO</span>
        </li>
        <li>
            <span class="text-size mb-3">{count?.invoices || 0}</span>
            <span>Total Invoices</span>
        </li>
    </ul>
  )
}

export default ReportHeader;
