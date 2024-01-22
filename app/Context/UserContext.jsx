'use client'

import { getUserData } from '@/apis/apis/adminApis';
import React, { useState, createContext, useContext, useEffect } from 'react';

const GlobalContext = createContext({
  user: {
    first_name: '',
    last_name: '',
    permissions: [],
    role: ''
  },
  setUser: () => {}
});

const initialUserState = {
  first_name: '',
  last_name: '',
  permissions: [],
  role: ''
};

export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserState);
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token) {
        getUserData().then((response) => {
            if(response?.data?.status) {
                setUser({
                    first_name: response.data.user_first_name,
                    last_name: response.data.user_last_name,
                    permissions: response.data.user_permissions,
                    role: response.data.user_role
                })
            }
        })
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
