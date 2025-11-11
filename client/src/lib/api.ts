import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CallTokenResponse {
  token: string;
  url: string;
  roomName: string;
  participantName: string;
}

export const getCallToken = async (roomName: string, participantName: string): Promise<CallTokenResponse> => {
  const response = await api.post<CallTokenResponse>("/call/token", {
    roomName,
    participantName,
  });
  return response.data;
};

export const getActiveRooms = async () => {
  const response = await api.get("/call/rooms");
  return response.data;
};

export default api;
