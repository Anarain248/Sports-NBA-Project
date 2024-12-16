import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TeamOutlined, UserOutlined, TrophyOutlined, DribbbleOutlined } from '@ant-design/icons';
import '../styles/Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <DribbbleOutlined className="hero-icon" />
        <Title level={1}>
          <span className="title-highlight">NBA</span> Professional Team Management System
        </Title>
        <Paragraph className="subtitle">
          A comprehensive solution for managing professional basketball teams, players, and coaching staff
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
              Professional team administration with roster management, conference tracking, and team analytics
            </Paragraph>
          </Card>
          <Card className="feature-card">
            <UserOutlined className="feature-icon" />
            <Title level={3}>Player Management</Title>
            <Paragraph>
              Complete player database with position tracking, performance metrics, and team assignment management
            </Paragraph>
          </Card>
          <Card className="feature-card">
            <TrophyOutlined className="feature-icon" />
            <Title level={3}>Coaching Staff</Title>
            <Paragraph>
              Professional coaching staff directory with experience tracking, specializations, and team assignments
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home; 