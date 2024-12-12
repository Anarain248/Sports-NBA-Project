import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AntHeader className="header">
      <div className="header-content">
        <div className="user-info">
          <UserOutlined />
          <Text className="username">{user?.username}</Text>
          <Text className="role">({user?.role})</Text>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header; 