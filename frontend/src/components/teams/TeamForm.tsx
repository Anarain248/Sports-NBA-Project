import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTeam, getTeamById, updateTeam, getTeams } from '../../services/teamService.ts';
import { Team } from '../../models/Team';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import '../../styles/TeamForm.css';
import { NBA_CITIES, CONFERENCE_MAPPING, VALID_TEAM_NAMES_FOR_CITY, NBA_TEAM_NAMES } from '../../constants/enums.ts';

const { Option } = Select;

const TeamForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [validTeamNames, setValidTeamNames] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchTeam();
    }
  }, [id]);

  const fetchTeam = async () => {
    try {
      const team = await getTeamById(id!);
      form.setFieldsValue(team);
    } catch (error) {
      message.error('Failed to fetch team details');
      navigate('/teams');
    }
  };

  const onFinish = async (values: Partial<Team>) => {
    try {
      setLoading(true);
      if (id) {
        await updateTeam(id, values);
        message.success('Team updated successfully');
      } else {
        await createTeam(values);
        message.success('Team created successfully');
      }
      navigate('/teams');
    } catch (error) {
      message.error(id ? 'Failed to update team' : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicateName = async (name: string) => {
    try {
      const teams = await getTeams();
      const duplicate = teams.some(team => 
        team.name.toLowerCase() === name.toLowerCase() && 
        team._id !== id
      );
      setIsDuplicateName(duplicate);
      return duplicate;
    } catch (error) {
      console.error('Error checking duplicate name:', error);
      return false;
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setValidTeamNames(VALID_TEAM_NAMES_FOR_CITY[city] || []);
    setIsDuplicateName(false);
    const conference = CONFERENCE_MAPPING[city];
    form.setFieldsValue({ 
      conference,
      name: undefined
    });
  };

  const validateTeamName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter team name');
    }
    if (!NBA_TEAM_NAMES.includes(value)) {
      return Promise.reject('Please enter a valid NBA team name');
    }
    if (selectedCity && !VALID_TEAM_NAMES_FOR_CITY[selectedCity].includes(value)) {
      return Promise.reject(`This team name is not valid for ${selectedCity}`);
    }
    return Promise.resolve();
  };

  return (
    <div className="team-form-container">
      <h1>{id ? 'Edit Team' : 'Create New Team'}</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="team-form"
        size="large"
      >
        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: 'Please select a city' }]}
        >
          <Select
            placeholder="Select city"
            showSearch
            onChange={handleCityChange}
            filterOption={(input, option) =>
              (option?.value?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {NBA_CITIES.map(city => (
              <Select.Option key={city} value={city} label={city}>
                {city}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Team Name"
          validateStatus={isDuplicateName ? 'error' : ''}
          help={isDuplicateName ? 'Team name already exists' : ''}
          rules={[
            { validator: validateTeamName },
            {
              validator: async (_, value) => {
                if (value) {
                  const isDuplicate = await checkDuplicateName(value);
                  if (isDuplicate) {
                    throw new Error('Team name already exists');
                  }
                }
              }
            }
          ]}
        >
          <Select
            placeholder={selectedCity ? `Select ${selectedCity} team name` : "Select city first"}
            disabled={!selectedCity}
            showSearch
            filterOption={(input, option) =>
              ((option?.value?.toString() ?? '') as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {validTeamNames.map(name => (
              <Select.Option key={name} value={name} label={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="conference" hidden>
          <Input />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="default" 
              onClick={() => navigate('/teams')}
              icon={<ArrowLeftOutlined />}
            >
              Back
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={isDuplicateName}
              icon={<SaveOutlined />}
            >
              {id ? 'Update Team' : 'Create Team'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TeamForm;