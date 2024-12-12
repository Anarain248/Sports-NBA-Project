import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select, InputNumber, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlayers, getPlayerById, createPlayer, updatePlayer } from '../../services/playerService.ts';
import { getTeams } from '../../services/teamService.ts';
import { getCoaches } from '../../services/coachService.ts';
import { Player } from '../../models/Player';
import { Team } from '../../models/Team';
import { Coach } from '../../models/Coach';
import { HomeOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../../styles/common/FormStyles.css';

const PlayerForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [isDuplicateJersey, setIsDuplicateJersey] = useState(false);
  const [existingPlayers, setExistingPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [existingCoaches, setExistingCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
    fetchCoaches();
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

  const fetchCoaches = async () => {
    try {
      const coaches = await getCoaches();
      setExistingCoaches(coaches);
    } catch (error) {
      message.error('Failed to fetch coaches');
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
    const normalizedFirstName = firstName.trim().toLowerCase();
    const normalizedLastName = lastName.trim().toLowerCase();
    
    const isDuplicatePlayer = existingPlayers.some(player => 
      player.firstName.trim().toLowerCase() === normalizedFirstName &&
      player.lastName.trim().toLowerCase() === normalizedLastName &&
      player._id !== id
    );

    const isDuplicateCoach = existingCoaches.some(coach => 
      coach.firstName.trim().toLowerCase() === normalizedFirstName &&
      coach.lastName.trim().toLowerCase() === normalizedLastName
    );

    const duplicateType = isDuplicatePlayer ? 'player' : isDuplicateCoach ? 'coach' : null;
    return { isDuplicate: isDuplicatePlayer || isDuplicateCoach, duplicateType };
  };

  const checkDuplicateJersey = (jerseyNumber: number, teamId: string) => {
    if (!teamId || !jerseyNumber) return false;
    
    return existingPlayers.some(player => {
      const playerTeamId = player.teamId || player.team?._id;
      return player.jerseyNumber === jerseyNumber && 
             playerTeamId === teamId && 
             player._id !== id;
    });
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.firstName || changedValues.lastName) {
      const values = form.getFieldsValue();
      if (values.firstName && values.lastName) {
        const { isDuplicate, duplicateType } = checkDuplicateName(values.firstName, values.lastName);
        setIsDuplicateName(isDuplicate);
        if (isDuplicate) {
          form.setFields([
            {
              name: 'firstName',
              errors: [`Name already exists as a ${duplicateType}`]
            },
            {
              name: 'lastName',
              errors: [`Name already exists as a ${duplicateType}`]
            }
          ]);
        }
      }
    }

    if (changedValues.jerseyNumber || changedValues.teamId) {
      const values = form.getFieldsValue();
      if (values.jerseyNumber && values.teamId) {
        const isDuplicate = checkDuplicateJersey(values.jerseyNumber, values.teamId);
        setIsDuplicateJersey(isDuplicate);
      }
    }

    if (changedValues.teamId) {
      setSelectedTeam(changedValues.teamId);
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
    
    const teamPlayers = existingPlayers.filter(player => 
      (player.teamId === teamId || player.team?._id === teamId) && 
      player._id !== id
    );
    return teamPlayers.length >= 12;
  };

  const checkTeamHasCoach = (teamId: string) => {
    return existingCoaches.some(coach => coach.teamId === teamId || coach.team?._id === teamId);
  };

  const onTeamChange = (value: string | null) => {
    if (!value) {
      setIsDuplicateJersey(false);
      form.setFieldValue('teamId', undefined);
      return;
    }

    const isAtCapacity = checkTeamCapacity(value);
    const hasCoach = checkTeamHasCoach(value);

    if (isAtCapacity) {
      message.warning('Team has reached maximum roster capacity');
      form.setFields([{
        name: 'teamId',
        errors: ['Team has reached maximum roster capacity']
      }]);
      form.setFieldValue('teamId', undefined);
      return;
    }

    if (!hasCoach) {
      message.warning('Team must have a coach assigned before adding players');
      form.setFields([{
        name: 'teamId',
        errors: ['Team must have a coach assigned']
      }]);
      form.setFieldValue('teamId', undefined);
      return;
    }

    const values = form.getFieldsValue();
    if (values.jerseyNumber) {
      const isDuplicate = checkDuplicateJersey(values.jerseyNumber, value);
      setIsDuplicateJersey(isDuplicate);
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
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        className="form-section"
        size="large"
      >
        <Form.Item
          name="firstName"
          label="First Name"
          validateStatus={isDuplicateName ? 'error' : ''}
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          validateStatus={isDuplicateName ? 'error' : ''}
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="teamId"
          label="Team"
          validateStatus={checkTeamCapacity(form.getFieldValue('teamId')) ? 'error' : ''}
        >
          <Select 
            placeholder="Select team"
            allowClear
            onChange={(value) => {
              onTeamChange(value);
              if (!value) {
                setIsDuplicateJersey(false);
                form.setFieldValue('teamId', undefined);
              }
            }}
          >
            {teams.map(team => {
              const isAtCapacity = checkTeamCapacity(team._id);
              const hasCoach = checkTeamHasCoach(team._id);
              return (
                <Select.Option 
                  key={team._id} 
                  value={team._id}
                  disabled={isAtCapacity || !hasCoach}
                >
                  {team.city} {team.name} 
                  {isAtCapacity ? ' (Full)' : !hasCoach ? ' (No Coach)' : ''}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="jerseyNumber"
          label="Jersey Number"
          validateStatus={isDuplicateJersey ? 'error' : ''}
          help={isDuplicateJersey ? 'Jersey number already exists in this team' : ''}
          rules={[
            { required: true, message: 'Please enter jersey number' },
            { type: 'number', min: 0, max: 99, message: 'Jersey number must be between 0 and 99' }
          ]}
        >
          <InputNumber min={0} max={99} placeholder="Enter jersey number" />
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

        <div className="form-buttons">
          <Button 
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={isDuplicateName || isDuplicateJersey}
            icon={<SaveOutlined />}
          >
            {id ? 'Update Player' : 'Create Player'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PlayerForm;
