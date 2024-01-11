// withAuth.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn, getUserRoles } from '@/apis/apis/shared';

const withAuth = (allowedRoles) => (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
        console.log(isLoggedIn())
      if (!isLoggedIn()) {
        router.push('/');
      } else {
        const userRoles = getUserRoles();
        console.log(userRoles)
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        console.log(hasRequiredRole)
        if (!hasRequiredRole) {
          router.push('/forbidden');
        }
      }
    }, []);

    return isLoggedIn() ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;