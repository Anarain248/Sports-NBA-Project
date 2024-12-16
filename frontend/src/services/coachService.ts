import { axiosInstance } from './authService.ts';
import { Coach } from '../models/Coach';

const API_BASE_URL = '/coaches';

export const getCoaches = async (): Promise<Coach[]> => {
  const response = await axiosInstance.get(API_BASE_URL);
  return response.data;
};

export const getCoachById = async (id: string): Promise<Coach> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createCoach = async (coach: Partial<Coach>): Promise<Coach> => {
  const response = await axiosInstance.post(API_BASE_URL, coach);
  return response.data;
};

export const updateCoach = async (id: string, coach: Partial<Coach>): Promise<Coach> => {
  const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, coach);
  return response.data;
};

export const deleteCoach = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/${id}`);
};
