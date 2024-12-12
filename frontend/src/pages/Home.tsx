import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TeamOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import '../styles/Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <Title level={1}>NBA Team Management System</Title>
        <Paragraph className="subtitle">
          Streamline your NBA team management with our comprehensive solution
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button size="large" onClick={() => navigate('/register')}>
            Register
          </Button>
        </Space>
      </div>

      <div className="features-section">
        <Title level={2}>Key Features</Title>
        <div className="feature-cards">
          <Card className="feature-card">
            <TeamOutlined className="feature-icon" />
            <Title level={3}>Team Management</Title>
            <Paragraph>
              Create and manage NBA teams with detailed information about players and coaches
            </Paragraph>
          </Card>
          <Card className="feature-card">
            <UserOutlined className="feature-icon" />
            <Title level={3}>Player Tracking</Title>
            <Paragraph>
              Keep track of player statistics, positions, and team assignments
            </Paragraph>
          </Card>
          <Card className="feature-card">
            <TrophyOutlined className="feature-icon" />
            <Title level={3}>Coach Directory</Title>
            <Paragraph>
              Maintain a comprehensive directory of coaches and their specializations
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home; 