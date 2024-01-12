import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn, getUserRoles } from '@/apis/apis/shared';

const withAuth = (allowedRoles) => (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn()) {
        router.push('/');
      } else {
        const userRoles = getUserRoles();
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
          router.push('/dashboard');
        }
        router.push('/dashboard');
      }
    }, []);

    return isLoggedIn() ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;