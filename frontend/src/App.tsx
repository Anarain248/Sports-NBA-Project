import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import TeamList from './components/teams/TeamList.tsx';
import TeamForm from './components/teams/TeamForm.tsx';

const App: React.FC = () => {
  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Button: {
            colorPrimary: '#1890ff',
            algorithm: true,
          },
        },
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<TeamList />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/teams/new" element={<TeamForm />} />
            <Route path="/teams/edit/:id" element={<TeamForm />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;