import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn } from '@/apis/apis/shared';
import { useGlobalContext } from '@/app/Context/UserContext';

const withAuth = (allowedRoles) => (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const { user } = useGlobalContext();

    useEffect(() => {
      if (!isLoggedIn()) {
        router.push('/');
      } else {
        const userRoles = user.roles;
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        if (!hasRequiredRole) {
          router.push('/dashboard');
        }
      }
    }, []);

    return isLoggedIn() ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default withAuth;