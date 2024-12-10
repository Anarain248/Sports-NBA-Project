import axios from 'axios';
import { Team } from '../models/Team';

const API_BASE_URL = 'http://localhost:8000/api/teams';

export const getTeams = async (): Promise<Team[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getTeamById = async (id: string): Promise<Team> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createTeam = async (team: Partial<Team>): Promise<Team> => {
  const response = await axios.post(API_BASE_URL, team);
  return response.data;
};

export const updateTeam = async (id: string, team: Partial<Team>): Promise<Team> => {
  const response = await axios.patch(`${API_BASE_URL}/${id}`, team);
  return response.data;
};

export const deleteTeam = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};