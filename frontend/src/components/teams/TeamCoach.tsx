import React, { useState, useEffect } from 'react';
import { Card, Button, message, Empty, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById } from '../../services/teamService.ts';
import { Coach } from '../../models/Coach';
import { Team } from '../../models/Team';
import { HomeOutlined } from '@ant-design/icons';
import '../../styles/common/TableStyles.css';

const TeamCoach: React.FC = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
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
      setCoach(teamData.coach || null);
    } catch (error) {
      message.error('Failed to fetch team data');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-container">
      <div className="header-section">
        <div className="title-section">
          <h1>{team?.city} {team?.name} Coach</h1>
          <span className="subtitle">Team Coach Information</span>
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

      {coach ? (
        <Card loading={loading}>
          <h2>{coach.firstName} {coach.lastName}</h2>
          <p><strong>Experience:</strong> {coach.experience} years</p>
          {coach.specialization && (
            <p><strong>Specialization:</strong> {coach.specialization}</p>
          )}
        </Card>
      ) : (
        <Empty 
          description="No coach assigned to this team" 
          style={{ margin: '48px 0' }}
        />
      )}
    </div>
  );
};

export default TeamCoach; 