import { axiosInstance } from './authService.ts';
import { Team } from '../models/Team';

const API_BASE_URL = '/teams';

export const getTeams = async (): Promise<Team[]> => {
  const response = await axiosInstance.get(API_BASE_URL);
  return response.data;
};

export const getTeamById = async (id: string): Promise<Team> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createTeam = async (team: Partial<Team>): Promise<Team> => {
  const response = await axiosInstance.post(API_BASE_URL, team);
  return response.data;
};

export const updateTeam = async (id: string, team: Partial<Team>): Promise<Team> => {
  const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, team);
  return response.data;
};

export const deleteTeam = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/${id}`);
};