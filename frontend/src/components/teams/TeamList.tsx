import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message, Input, Tag, Space, Tooltip } from 'antd';
import { Team } from '../../models/Team';
import { getTeams, deleteTeam, getTeamById } from '../../services/teamService.ts';
import { useNavigate } from 'react-router-dom';
import { 
  TeamOutlined, 
  UserOutlined, 
  TrophyOutlined, 
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
  HomeOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import '../../styles/common/ListStyles.css';
import '../../styles/common/TableStyles.css';
import '../../styles/common/FormStyles.css';

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
    setFilteredTeams(filtered);
  }, [searchText, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const fetchedTeams = await getTeams();
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
      const team = await getTeamById(teamId);
      
      if (team.players && team.players.length > 0) {
        message.error('Cannot delete team with assigned players. Please remove all players first.');
        return;
      }

      if (team.coach) {
        message.error('Cannot delete team with an assigned coach. Please remove the coach first.');
        return;
      }

      await deleteTeam(teamId);
      message.success('Team deleted successfully');
      fetchTeams();
    } catch (error) {
      message.error('Failed to delete team');
    }
  };

  const columns = [
    {
      title: 'Team',
      key: 'name',
      render: (_: string, record: Team) => (
        <span className="team-name">
          {`${record.city} ${record.name}`}
        </span>
      )
    },
    {
      title: 'Conference',
      dataIndex: 'conference',
      key: 'conference',
      render: (text: string) => (
        <span className={`conference-tag ${text.toLowerCase()}`}>
          {text}
        </span>
      )
    },
    {
      title: 'Coach',
      key: 'coach',
      render: (_: string, record: Team) => {
        return record.coach 
          ? `${record.coach.firstName} ${record.coach.lastName}`
          : 'No Coach Assigned';
      },
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
      render: (_: string, record: Team) => {
        const hasAssignments = ((record.players && record.players.length > 0) || !!record.coach);
        const tooltipText = hasAssignments ? 
          "Can't delete team since there are coach or players assigned" : 
          "Delete team";

        return (
          <div className="action-buttons">
            <Tooltip title="View and manage team roster">
              <Button 
                onClick={() => navigate(`/teams/${record._id}/players`)}
                icon={<TeamOutlined />}
                className="action-button"
              >
                Players
              </Button>
            </Tooltip>
            <Tooltip title="View and manage team coach">
              <Button 
                onClick={() => navigate(`/teams/${record._id}/coach`)}
                icon={<UserOutlined />}
                className="action-button"
              >
                Coach
              </Button>
            </Tooltip>
            <Tooltip title={hasAssignments ? "Cannot edit team with assigned players or coach" : "Edit team details"}>
              <Button 
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/teams/edit/${record._id}`)}
                disabled={hasAssignments}
                className="action-button"
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title={tooltipText}>
              <Button 
                type="primary" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record._id)}
                disabled={hasAssignments}
                className="action-button"
              >
                Delete
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="title-section">
          <h1>Teams Management</h1>
          <span className="subtitle">Manage NBA teams</span>
        </div>
        <Space className="action-buttons">
          <Tooltip title="View and manage all coaches">
            <Button 
              icon={<UserOutlined />}
              onClick={() => navigate('/coaches')}
              size="large"
            >
              Manage Coaches
            </Button>
          </Tooltip>
          <Tooltip title="View and manage all players">
            <Button 
              icon={<TeamOutlined />}
              onClick={() => navigate('/players')}
              size="large"
            >
              Manage Players
            </Button>
          </Tooltip>
          <Tooltip title="Create a new NBA team">
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={() => navigate('/teams/new')}
              size="large"
            >
              Add New Team
            </Button>
          </Tooltip>
        </Space>
      </div>
      <div className="content-section">
        <div className="search-section">
          <Input
            placeholder="Search teams by name, city, or conference..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="search-input"
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
            showTotal: (total) => `Total ${total} ${total === 1 ? 'team' : 'teams'}`,
          }}
          className="teams-table"
        />
      </div>
    </div>
  );
};

export default TeamList;