'use client'
import React from 'react';
import { useGlobalContext } from '@/app/Context/UserContext';

function Roles({ children, action }) {
  const { user } = useGlobalContext();
  if(!user?.permissions?.includes(action)) {
    return <></>
  }

  return (
    <>
      {children}
    </>
  )
}

export default Roles;
