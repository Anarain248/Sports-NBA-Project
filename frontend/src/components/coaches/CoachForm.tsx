import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createCoach, getCoachById, updateCoach, getCoaches } from '../../services/coachService.ts';
import { getTeams } from '../../services/teamService.ts';
import { Coach } from '../../models/Coach';
import { Team } from '../../models/Team';
import { ArrowLeftOutlined, SaveOutlined, HomeOutlined } from '@ant-design/icons';
import '../../styles/common/FormStyles.css';

const CoachForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [existingCoaches, setExistingCoaches] = useState<Coach[]>([]);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    fetchTeams();
    fetchCoaches();
    if (id) {
      fetchCoach();
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

  const fetchCoaches = async () => {
    try {
      const coaches = await getCoaches();
      setExistingCoaches(coaches);
    } catch (error) {
      message.error('Failed to fetch coaches');
    }
  };

  const fetchCoach = async () => {
    try {
      const coach = await getCoachById(id!);
      form.setFieldsValue({
        ...coach,
        teamId: coach.team?._id
      });
    } catch (error) {
      message.error('Failed to fetch coach details');
      navigate('/coaches');
    }
  };

  const checkDuplicateName = (firstName: string, lastName: string) => {
    const duplicate = existingCoaches.some(coach => 
      coach.firstName.toLowerCase() === firstName.toLowerCase() &&
      coach.lastName.toLowerCase() === lastName.toLowerCase() &&
      coach._id !== id
    );
    setIsDuplicateName(duplicate);
    return duplicate;
  };

  const checkTeamHasCoach = (teamId: string) => {
    return existingCoaches.some(coach => 
      (coach.teamId === teamId || coach.team?._id === teamId)
    );
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.firstName || changedValues.lastName) {
      const values = form.getFieldsValue();
      if (values.firstName && values.lastName) {
        const isDuplicate = checkDuplicateName(values.firstName, values.lastName);
        setFormValid(!isDuplicate);
      }
    }

    if (changedValues.teamId) {
      const hasCoach = checkTeamHasCoach(changedValues.teamId);
      if (hasCoach) {
        message.warning('This team already has a coach assigned');
        form.setFieldValue('teamId', undefined);
      }
    }
  };

  const onFinish = async (values: Partial<Coach>) => {
    try {
      setLoading(true);
      if (id) {
        await updateCoach(id, values);
        message.success('Coach updated successfully');
      } else {
        await createCoach(values);
        message.success('Coach created successfully');
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/coaches');
    } catch (error) {
      message.error(id ? 'Failed to update coach' : 'Failed to create coach');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="header-section">
        <h1>{id ? 'Edit Coach' : 'Create New Coach'}</h1>
        <Button 
          onClick={() => navigate('/coaches')}
          icon={<HomeOutlined />}
        >
          Back to Coaches
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
          rules={[
            { required: true, message: 'Please enter first name' },
            {
              validator: async (_, value) => {
                if (value) {
                  const lastName = form.getFieldValue('lastName');
                  if (lastName && checkDuplicateName(value, lastName)) {
                    throw new Error('Coach with this name already exists');
                  }
                }
              }
            }
          ]}
          validateStatus={isDuplicateName ? 'error' : ''}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: 'Please enter last name' },
            {
              validator: async (_, value) => {
                if (value) {
                  const firstName = form.getFieldValue('firstName');
                  if (firstName && checkDuplicateName(firstName, value)) {
                    throw new Error('Coach with this name already exists');
                  }
                }
              }
            }
          ]}
          validateStatus={isDuplicateName ? 'error' : ''}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="experience"
          label="Years of Experience"
          rules={[{ required: true, message: 'Please enter years of experience' }]}
        >
          <InputNumber min={0} max={50} placeholder="Enter years of experience" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="specialization"
          label="Specialization"
        >
          <Input placeholder="Enter specialization (e.g., Defense, Offense)" />
        </Form.Item>

        <Form.Item
          name="teamId"
          label="Team"
          rules={[
            {
              validator: async (_, value) => {
                if (value && checkTeamHasCoach(value)) {
                  throw new Error('This team already has a coach assigned');
                }
              }
            }
          ]}
        >
          <Select
            placeholder="Select team"
            allowClear
          >
            {teams.map(team => {
              const hasCoach = checkTeamHasCoach(team._id);
              return (
                <Select.Option 
                  key={team._id} 
                  value={team._id}
                  disabled={hasCoach}
                >
                  {team.city} {team.name} {hasCoach ? '(Has Coach)' : ''}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <div className="form-buttons">
          <Button 
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            disabled={!formValid || isDuplicateName}
          >
            {id ? 'Update Coach' : 'Create Coach'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CoachForm;
