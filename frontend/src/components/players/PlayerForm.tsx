import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, InputNumber, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlayers, getPlayerById, createPlayer, updatePlayer } from '../../services/playerService.ts';
import { getTeams } from '../../services/teamService.ts';
import { Player } from '../../models/Player';
import { Team } from '../../models/Team';
import { HomeOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../../styles/common/FormStyles.css';

const PlayerForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
    if (id) {
      fetchPlayer();
    }
  }, [id]);

  const fetchTeams = async () => {
    try {
      const teamsData = await getTeams();
      setTeams(teamsData);
    } catch (error) {
      message.error('Failed to fetch teams');
    }
  };

  const fetchPlayers = async () => {
    try {
      const players = await getPlayers();
      setExistingPlayers(players);
    } catch (error) {
      message.error('Failed to fetch players');
    }
  };

  const fetchPlayer = async () => {
    try {
      const player = await getPlayerById(id!);
      form.setFieldsValue({
        ...player,
        teamId: player.team?._id
      });
    } catch (error) {
      message.error('Failed to fetch player details');
      navigate('/players');
    }
  };

  const onFinish = async (values: Partial<Player>) => {
    try {
      if (values.teamId && checkTeamCapacity(values.teamId)) {
        message.error('Team has reached maximum roster capacity');
        return;
      }
      
      setLoading(true);
      if (id) {
        await updatePlayer(id, values);
        message.success('Player updated successfully');
        navigate('/players');
      } else {
        await createPlayer(values);
        message.success('Player created successfully');
        navigate('/players');
      }
    } catch (error) {
      message.error(id ? 'Failed to update player' : 'Failed to create player');
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicateName = (firstName: string, lastName: string) => {
    const duplicate = existingPlayers.some(player => 
      player.firstName.toLowerCase() === firstName.toLowerCase() &&
      player.lastName.toLowerCase() === lastName.toLowerCase() &&
      player._id !== id
    );
    setIsDuplicateName(duplicate);
    return duplicate;
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.firstName || changedValues.lastName) {
      const values = form.getFieldsValue();
      if (values.firstName && values.lastName) {
        checkDuplicateName(values.firstName, values.lastName);
      }
    }
  };

  const positions = [
    'Point Guard',
    'Shooting Guard',
    'Small Forward',
    'Power Forward',
    'Center'
  ];

  const checkTeamCapacity = (teamId: string) => {
    if (!teamId) return false;
    const teamPlayers = existingPlayers.filter(player => player.teamId === teamId && player._id !== id);
    return teamPlayers.length >= 12;
  };

  const onTeamChange = (teamId: string) => {
    const isTeamFull = checkTeamCapacity(teamId);
    if (isTeamFull) {
      message.warning('This team has reached the maximum roster capacity of 12 players');
    }
  };

  return (
    <div className="form-container">
      <div className="header-section">
        <h1>{id ? 'Edit Player' : 'Create New Player'}</h1>
        <Button 
          onClick={() => navigate('/players')}
          icon={<HomeOutlined />}
        >
          Back to Players
        </Button>
      </div>
      
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        layout="vertical"
        className="form-section"
        size="large"
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please input first name!' }]}
          validateStatus={isDuplicateName ? 'error' : ''}
          help={isDuplicateName ? 'A player with this name already exists' : ''}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please input last name!' }]}
          validateStatus={isDuplicateName ? 'error' : ''}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please select position!' }]}
        >
          <Select>
            {positions.map(pos => (
              <Select.Option key={pos} value={pos}>
                {pos}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="jerseyNumber"
          label="Jersey Number"
          rules={[{ required: true, message: 'Please input jersey number!' }]}
        >
          <InputNumber min={0} max={99} />
        </Form.Item>

        <Form.Item
          name="height"
          label="Height"
        >
          <Input placeholder="e.g., 6'6&quot;" />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Weight"
        >
          <Input placeholder="e.g., 215 lbs" />
        </Form.Item>

        <Form.Item
          name="teamId"
          label="Team"
        >
          <Select allowClear placeholder="Select a team" onChange={onTeamChange}>
            {teams.map(team => (
              <Select.Option key={team._id} value={team._id}>
                {team.city} {team.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="form-buttons">
          <Tooltip title={id ? "Save changes to player" : "Create new player"}>
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              disabled={isDuplicateName}
            >
              {id ? 'Update Player' : 'Create Player'}
            </Button>
          </Tooltip>
        </div>
      </Form>
    </div>
  );
};

export default PlayerForm;
