import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Room {
  roomId: string;
  displayName: string;
  roomType: "audio" | "video";
  expiresAt: string | null;
  roomUrl?: string;
}

export interface CreateRoomResponse {
  success: boolean;
  room: Room;
}

export interface RoomDetailsResponse {
  success: boolean;
  room: Room;
}

export interface CallTokenResponse {
  token: string;
  url: string;
  roomId: string;
  displayName: string;
  participantName: string;
}

// Create a new room
export const createRoom = async (
  displayName: string,
  roomType: "audio" | "video",
  expiryHours?: number
): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>("/call/create-room", {
    displayName,
    roomType,
    expiryHours,
  });
  return response.data;
};

// Get room details
export const getRoomDetails = async (roomId: string): Promise<RoomDetailsResponse> => {
  const response = await api.get<RoomDetailsResponse>(`/call/room/${roomId}`);
  return response.data;
};

// Generate token to join a room
export const getCallToken = async (
  roomId: string,
  participantName: string
): Promise<CallTokenResponse> => {
  const response = await api.post<CallTokenResponse>("/call/token", {
    roomId,
    participantName,
  });
  return response.data;
};

// End a room
export const endRoom = async (roomId: string) => {
  const response = await api.post(`/call/end-room/${roomId}`);
  return response.data;
};

export const getActiveRooms = async () => {
  const response = await api.get("/call/rooms");
  return response.data;
};

export default api;
