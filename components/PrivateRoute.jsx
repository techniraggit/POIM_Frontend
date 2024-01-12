import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn, getUserRoles } from '@/apis/apis/shared';

const withAuth = (allowedRoles) => (WrappedComponent) => {
  console.log(allowedRoles,'allowedRoles');
  const AuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn()) {
        router.push('/');
      } else {
        const userRoles = getUserRoles();
        console.log(userRoles,'userRoles');
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        console.log(hasRequiredRole,'hasRequiredRole');
        if (!hasRequiredRole) {
          router.push('/dashboard');
        }
        // router.push('/dashboard');
      }
    }, []);

    return isLoggedIn() ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;