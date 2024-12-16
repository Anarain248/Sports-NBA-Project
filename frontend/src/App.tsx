import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider, Layout, Button } from 'antd';
import { useAuth } from './contexts/AuthContext.tsx';
import TeamList from './components/teams/TeamList.tsx';
import TeamForm from './components/teams/TeamForm.tsx';
import CoachList from './components/coaches/CoachList.tsx';
import CoachForm from './components/coaches/CoachForm.tsx';
import PlayerList from './components/players/PlayerList.tsx';
import PlayerForm from './components/players/PlayerForm.tsx';
import TeamPlayers from './components/teams/TeamPlayers.tsx';
import TeamCoach from './components/teams/TeamCoach.tsx';
import './App.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/Login.tsx';
import Unauthorized from './pages/Unauthorized.tsx';
import Register from './pages/Register.tsx';
import './styles/common/Layout.css';
import './styles/common/ButtonStyles.css';
import Home from './pages/Home.tsx';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPage = publicPaths.includes(location.pathname);

  if (isPublicPage) {
    return (
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              colorText: '#000000',
              colorTextLightSolid: '#ffffff',
            },
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </ConfigProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            colorText: '#000000',
            colorTextLightSolid: '#ffffff',
          },
        }}
      >
        <Layout className="app-container">
          <Header className="top-nav">
            <div className="nav-left">
              <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer', margin: 0 }}>
                <span className="title-highlight">NBA</span> Professional Team Management System
              </h2>
            </div>
            <HeaderContent />
          </Header>
          <Content className="content-container">
            <Routes>
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/*" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
              <Route path="/teams/new" element={<TeamForm />} />
              <Route path="/teams/edit/:id" element={<TeamForm />} />
              <Route path="/coaches" element={<CoachList />} />
              <Route path="/coaches/new" element={<CoachForm />} />
              <Route path="/coaches/edit/:id" element={<CoachForm />} />
              <Route path="/players" element={<PlayerList />} />
              <Route path="/players/new" element={<PlayerForm />} />
              <Route path="/players/edit/:id" element={<PlayerForm />} />
              <Route path="/teams/:id/players" element={<TeamPlayers />} />
              <Route path="/teams/:id/coach" element={<TeamCoach />} />
            </Routes>
          </Content>
        </Layout>
      </ConfigProvider>
    </AuthProvider>
  );
};

// Separate component for header content to use auth context
const HeaderContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="nav-right">
      <Button 
        icon={<HomeOutlined />} 
        onClick={() => navigate('/')}
        type="link"
      >
        Home
      </Button>
      <div className="user-info">
        <span>{user?.username}</span>
        <span>({user?.role})</span>
      </div>
      <Button 
        onClick={handleLogout} 
        type="primary"
        icon={<LogoutOutlined />}
      >
        Logout
      </Button>
    </div>
  );
};

export default App;