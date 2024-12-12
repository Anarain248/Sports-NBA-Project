import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { loginUser } from '../services/authService.ts';
import '../styles/Login.css';
import { HomeOutlined } from '@ant-design/icons';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      message.info('You are already logged in');
      navigate('/teams');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await loginUser(values);
      login(response.access_token, response.user);
      message.success('Login successful');
      navigate('/teams');
    } catch (error) {
      message.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
      >
        <h1>Login</h1>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          Need an account? <Link to="/register">Register here</Link>
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

export default Login; 