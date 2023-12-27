import { useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/router';
import {getServerSideProps} from '../components/mainVariable'

const Logout = ({ base_url }) => {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');

        if (!access_token || !refresh_token) {
          throw new Error('No access_token or access_refresh found in localStorage.');
        }

        // const headers = {
        //   Authorization: ` Bearer ${localStorage.getItem('access_token')}`,
        // }

        const headers = {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        };

        const response = await axios.get(
            `${base_url}/api/accounts/logout? refresh_token=${refresh_token}`,
            // { refresh_token: access_refresh },
          { headers }
        );
        console.log(response,'logout response');

        if (response.status === 200) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          message.success('Logout successful');
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
