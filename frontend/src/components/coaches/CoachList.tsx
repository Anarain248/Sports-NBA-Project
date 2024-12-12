import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, message, Popconfirm, Tooltip } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { getCoaches, deleteCoach } from '../../services/coachService.ts';
import { Coach } from '../../models/Coach';
import { UserOutlined, EditOutlined, DeleteOutlined, SearchOutlined, HomeOutlined } from '@ant-design/icons';
import '../../styles/CoachList.css';

const CoachList: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await getCoaches();
      setCoaches(data);
    } catch (error) {
      message.error('Failed to fetch coaches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteCoach(id);
      setCoaches(prevCoaches => prevCoaches.filter(coach => coach._id !== id));
      message.success('Coach deleted successfully');
    } catch (error) {
      message.error('Failed to delete coach');
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text: any, record: Coach) => `${record.firstName} ${record.lastName}`,
      filteredValue: [searchText],
      onFilter: (value: string, record: Coach) => 
        `${record.firstName} ${record.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (exp: number) => `${exp} years`,
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Team',
      key: 'team',
      render: (_: string, record: Coach) => 
        record.team ? `${record.team.city} ${record.team.name}` : 'Unassigned',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Coach) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/coaches/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this coach?"
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
    <div className="coach-list-container">
      <div className="header-section">
        <div className="title-section">
          <h1>Coaches Management</h1>
          <span className="subtitle">Manage NBA team coaches</span>
        </div>
        <Space>
          <Tooltip title="Return to teams management">
            <Button 
              icon={<HomeOutlined />}
              onClick={() => navigate('/teams')}
              size="large"
            >
              Home
            </Button>
          </Tooltip>
          <Tooltip title="Add a new coach to the system">
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              onClick={() => navigate('/coaches/new')}
              size="large"
            >
              Add New Coach
            </Button>
          </Tooltip>
        </Space>
      </div>

      <Input
        placeholder="Search coaches..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />

      <Table
        columns={columns as any}
        dataSource={coaches}
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default CoachList;
