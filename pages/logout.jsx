import { useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/router';
import {getServerSideProps} from '../components/mainVariable'
import { useGlobalContext } from '@/app/Context/UserContext';

const Logout = ({ base_url }) => {
  const router = useRouter();
  const { setUser } = useGlobalContext();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');

        if (!access_token || !refresh_token) {
          throw new Error('No access_token or access_refresh found in localStorage.');
        }

        const response = await axios.post(
            `${base_url}/sso/auth/revoke-token`, {
              client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
              client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
              token: access_token
            }
        );
        if (response.status === 204) {
          localStorage.clear();
          message.success('Logout successful');
          setUser({
            first_name: '',
            last_name: '',
            permissions: [],
            role: ''
          })
          router.push('/');
        } else {
          message.error('Logout failed');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        message.error('Error during logout');
      }
    };

    logoutUser();
  }, [router, base_url]);

  return <div>Logging out...</div>;
};

export { getServerSideProps };
export default Logout;
