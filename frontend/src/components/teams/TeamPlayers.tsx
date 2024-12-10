import React, { useState, useEffect } from 'react';
import { Table, Button, message, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById } from '../../services/teamService.ts';
import { Player } from '../../models/Player';
import { Team } from '../../models/Team';
import { HomeOutlined, UserAddOutlined } from '@ant-design/icons';
import '../../styles/common/TableStyles.css';

const TeamPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamData();
  }, [id]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const teamData = await getTeamById(id!);
      setTeam(teamData);
      setPlayers(teamData.players || []);
    } catch (error) {
      message.error('Failed to fetch team data');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: Player) => `${record.firstName} ${record.lastName}`,
      sorter: (a: Player, b: Player) => 
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Jersey Number',
      dataIndex: 'jerseyNumber',
      key: 'jerseyNumber',
      sorter: (a: Player, b: Player) => a.jerseyNumber - b.jerseyNumber,
    },
    {
      title: 'Height',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
    }
  ];

  return (
    <div className="table-container">
      <div className="header-section">
        <div className="title-section">
          <h1>{team?.city} {team?.name} Players</h1>
          <span className="subtitle">Team Roster</span>
        </div>
        <Tooltip title="Return to teams list">
          <Button 
            onClick={() => navigate('/teams')}
            icon={<HomeOutlined />}
          >
            Back to Teams
          </Button>
        </Tooltip>
      </div>

      <Table 
        columns={columns}
        dataSource={players}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} players`,
        }}
      />
    </div>
  );
};

export default TeamPlayers; 