import { axiosInstance } from './authService.ts';
import { Player } from '../models/Player';

const API_BASE_URL = '/players';

export const getPlayers = async (): Promise<Player[]> => {
  const response = await axiosInstance.get(API_BASE_URL);
  return response.data;
};

export const getPlayerById = async (id: string): Promise<Player> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createPlayer = async (player: Partial<Player>): Promise<Player> => {
  const response = await axiosInstance.post(API_BASE_URL, {
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    jerseyNumber: player.jerseyNumber,
    height: player.height,
    weight: player.weight,
    teamId: player.teamId
  });
  return response.data;
};

export const updatePlayer = async (id: string, player: Partial<Player>): Promise<Player> => {
  const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, player);
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE_URL}/${id}`);
};
