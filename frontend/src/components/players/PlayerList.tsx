import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Input, Popconfirm, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPlayers, deletePlayer } from '../../services/playerService.ts';
import { Player } from '../../models/Player';
import { EditOutlined, DeleteOutlined, UserAddOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

import '../../styles/common/ListStyles.css';
import '../../styles/common/TableStyles.css';
import '../../styles/common/FormStyles.css';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getPlayers();
      setPlayers(data);
    } catch (error) {
      message.error('Failed to fetch players');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deletePlayer(id);
      setPlayers(prevPlayers => prevPlayers.filter(player => player._id !== id));
      message.success('Player deleted successfully');
    } catch (error) {
      message.error('Failed to delete player');
    }
  };

  const columns: ColumnType<Player>[] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      filteredValue: [searchText],
      onFilter: (value, record) => 
        `${record.firstName} ${record.lastName}`
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
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
    },
    {
      title: 'Team',
      key: 'team',
      render: (_, record) => record.team ? `${record.team.city} ${record.team.name}` : 'Unassigned',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/players/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this player?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="title-section">
          <h1>Players Management</h1>
          <span className="subtitle">Manage NBA team players</span>
        </div>
        <Space className="action-buttons">
          <Tooltip title="Return to teams management">
            <Button 
              icon={<HomeOutlined />}
              onClick={() => navigate('/teams')}
              size="large"
            >
              Home
            </Button>
          </Tooltip>
          <Tooltip title="Add a new player">
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={() => navigate('/players/new')}
              size="large"
            >
              Add New Player
            </Button>
          </Tooltip>
        </Space>
      </div>
      <div className="content-section">
        <div className="search-section">
          <Input
            placeholder="Search players..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="search-input"
          />
        </div>
        <Table
          columns={columns}
          dataSource={players}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            total: players.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} ${total === 1 ? 'player' : 'players'}`,
          }}
          className="teams-table"
          style={{ marginTop: 0 }}
        />
      </div>
    </div>
  );
};

export default PlayerList;
