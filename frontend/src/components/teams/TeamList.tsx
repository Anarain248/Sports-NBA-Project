import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message, Input, Tag } from 'antd';
import { Team } from '../../models/Team';
import { getTeams, deleteTeam } from '../../services/teamService.ts';
import { useNavigate } from 'react-router-dom';
import { 
  TeamOutlined, 
  UserOutlined, 
  TrophyOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import '../../styles/TeamList.css';

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(searchText.toLowerCase()) ||
      team.city.toLowerCase().includes(searchText.toLowerCase()) ||
      team.conference.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log(teams)
    setFilteredTeams(filtered);
  }, [searchText, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const fetchedTeams = await getTeams();
      console.log(fetchedTeams)
      setTeams(fetchedTeams);
      setFilteredTeams(fetchedTeams);
    } catch (error) {
      message.error('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      const updatedTeams = teams.filter(team => team._id !== teamId);
      setTeams(updatedTeams);
      setFilteredTeams(updatedTeams);
      message.success('Team deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete team');
    }
  };

  const columns = [
    {
      title: 'Team',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Team) => (
        <div className="team-name-cell">
          <span className="team-name">{name}</span>
          <span className="team-city">{record.city}</span>
        </div>
      ),
      sorter: (a: Team, b: Team) => a.name.localeCompare(b.name),
    },
    {
      title: 'Conference',
      dataIndex: 'conference',
      key: 'conference',
      render: (conference: string) => (
        <Tag color={conference === 'Eastern' ? 'blue' : 'red'}>
          {conference}
        </Tag>
      ),
      filters: [
        { text: 'Eastern', value: 'Eastern' },
        { text: 'Western', value: 'Western' },
      ],
      onFilter: (value: string, record: Team) => record.conference === value,
    },
    {
      title: 'Coach',
      dataIndex: 'coach',
      key: 'coach',
      render: (coach: any) => (
        <span className="coach-name">
          {coach ? `${coach.firstName} ${coach.lastName}` : 'No Coach Assigned'}
        </span>
      ),
    },
    {
      title: 'Roster Size',
      dataIndex: 'players',
      key: 'players',
      render: (players: any[]) => (
        <span className="roster-size">
          {players ? players.length : 0} Players
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: Team) => (
        <div className="action-buttons">
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/teams/edit/${record._id}`)}
            title="Edit Team"
            className="action-button"
          >
            Edit
          </Button>
          <Button 
            icon={<UserOutlined />}
            onClick={() => navigate(`/teams/${record._id}/players`)}
            title="Manage Players"
            className="action-button"
          >
            Players
          </Button>
          <Button 
            icon={<UserSwitchOutlined />}
            onClick={() => navigate(`/teams/${record._id}/coach`)}
            title="Manage Coach"
            className="action-button"
          >
            Coach
          </Button>
          <Button 
            type="primary" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            title="Delete Team"
            className="action-button"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="team-list-container">
      <div className="header-section">
        <div className="title-section">
          <h1>NBA Teams Management</h1>
          <span className="subtitle">Manage teams, coaches, and players</span>
        </div>
        <div className="action-buttons">
          <Button 
            type="primary" 
            icon={<TeamOutlined />}
            onClick={() => navigate('/teams/new')}
            size="large"
            className="add-team-btn action-button"
          >
            Add New Team
          </Button>
          <Button 
            onClick={() => navigate('/coaches')}
            icon={<UserOutlined />}
            size="large"
            className="action-button"
          >
            Manage Coaches
          </Button>
          <Button 
            onClick={() => navigate('/players')}
            icon={<TrophyOutlined />}
            size="large"
            className="action-button"
          >
            Manage Players
          </Button>
        </div>
      </div>

      <div className="search-section">
        <Input
          placeholder="Search teams by name, city, or conference..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="search-input"
          allowClear
        />
      </div>

      <Table 
        columns={columns as any} 
        dataSource={filteredTeams} 
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} teams`,
        }}
        className="teams-table"
      />
    </div>
  );
};

export default TeamList;