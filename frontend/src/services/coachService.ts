import axios from 'axios';
import { Coach } from '../models/Coach';

const API_BASE_URL = 'http://localhost:8000/api/coaches';

export const getCoaches = async (): Promise<Coach[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getCoachById = async (id: string): Promise<Coach> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createCoach = async (coach: Partial<Coach>): Promise<Coach> => {
  const response = await axios.post(API_BASE_URL, coach);
  return response.data;
};

export const updateCoach = async (id: string, coach: Partial<Coach>): Promise<Coach> => {
  const response = await axios.patch(`${API_BASE_URL}/${id}`, coach);
  return response.data;
};

export const deleteCoach = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
