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
              const data = response.data.data;
              setUser({
                  first_name: data.first_name,
                  last_name: data.last_name,
                  permissions: data.permissions || [],
                  role: data.role
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
