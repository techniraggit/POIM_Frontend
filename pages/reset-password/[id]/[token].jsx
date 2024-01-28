import React, { useState } from 'react';
import '../../../styles/change-password.css'; // Make sure to import your CSS file
import { useRouter } from 'next/router';
import { getServerSideProps } from "@/components/mainVariable";
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ChangePasswordForm = ({ base_url }) => {
  //   const [new_password, setPassword] = useState('');
  //   const [confirm_password, setConfirmPassword] = useState('');

  const router = useRouter();
  const { id, token } = router.query;

  const onFinish = async (values) => {
    const { new_password, confirm_password } = values;

    try {
      const response = await axios.post(`${base_url}/api/accounts/verify-token-make-password`, {
        id: id,
        token: token,
        new_password: new_password,
        confirm_password: confirm_password // Include password2 in the request body
      });

      if (response.status === 200) {
        message.success(response.data.message);
        router.push('/login'); // Redirect to login page or any other page
      } else {
        message.error('Password reset failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      message.error('Password reset failed');
    }
    // Add your form submission logic here
  };

  const onFinishFailed = (errorInfo) => {
   
  };

  return (
    <div className="mainDiv">
      <div className="cardStyle">
        <Form
          name="signupForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <img src="/images/logo.png" id="signupLogo" alt="Logo" />

          <h2 className="formTitle">Login to your account</h2>

          <div className="inputDiv">
            <Form.Item
              label="New Password"
              name="new_password"
              className="inputLabel"
              htmlFor="new_password"
              // value={password}
              rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <div className="inputDiv">
            <Form.Item
              label="Confirm Password"
              name="confirm_password"
              htmlFor="confirm_password"
              // value={confirmPassword}
              id="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <div className="buttonWrapper">
            <Form.Item>
              <div className="buttonWrapper">
                <Button
                  type="primary"
                  htmlType="submit"
                  id="submitButton"
                  className="submitButton pure-button pure-button-primary"
                >
                  Continue
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
        {/* </form> */}
      </div>
    </div>
  );
};
export { getServerSideProps };
export default ChangePasswordForm;
