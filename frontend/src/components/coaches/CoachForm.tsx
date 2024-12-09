import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createCoach, getCoachById, updateCoach } from '../../services/coachService.ts';
import { getTeams } from '../../services/teamService.ts';
import { Coach } from '../../models/Coach';
import { Team } from '../../models/Team';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import '../../styles/CoachForm.css';

const CoachForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchTeams();
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
    <div className="coach-form-container">
      <h1>{id ? 'Edit Coach' : 'Create New Coach'}</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="coach-form"
        size="large"
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
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
        >
          <Select
            placeholder="Select team"
            allowClear
          >
            {teams.map(team => (
              <Select.Option key={team._id} value={team._id}>
                {team.city} {team.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="default" 
              onClick={() => navigate('/coaches')}
              icon={<ArrowLeftOutlined />}
            >
              Back
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {id ? 'Update Coach' : 'Create Coach'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CoachForm;
