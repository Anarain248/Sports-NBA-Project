import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService.ts';
import '../styles/Login.css'; // We can reuse the login styles
import { HomeOutlined } from '@ant-design/icons';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: values.username,
        password: values.password,
      });
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed. Username might be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <h1>Register</h1>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Please confirm your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button 
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            type="link"
            size="small"
          >
            Back to Home
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register; 