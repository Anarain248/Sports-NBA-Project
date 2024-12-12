import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const Unauthorized= () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={[
        <Button type="primary" onClick={() => navigate(-1)} key="back">
          Go Back
        </Button>,
        <Button onClick={handleLogout} key="logout">
          Logout
        </Button>,
      ]}
    />
  );
};

export default Unauthorized; 