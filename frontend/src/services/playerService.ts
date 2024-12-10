import axios from 'axios';
import { Player } from '../models/Player';

const API_BASE_URL = 'http://localhost:8000/api/players';

export const getPlayers = async (): Promise<Player[]> => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getPlayerById = async (id: string): Promise<Player> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createPlayer = async (player: Partial<Player>): Promise<Player> => {
  const response = await axios.post(API_BASE_URL, player);
  return response.data;
};

export const updatePlayer = async (id: string, player: Partial<Player>): Promise<Player> => {
  const response = await axios.patch(`${API_BASE_URL}/${id}`, player);
  return response.data;
};

export const deletePlayer = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
