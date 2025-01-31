import axios from 'axios';
import { auth } from '../config/firebase';

// Determine the API URL based on environment
const API_URL = import.meta.env.PROD 
  ? 'https://note-taking-backend-xr3x.onrender.com/api'
  : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Note types
export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title: string;
  content: string;
}

export interface SummarizeResponse {
  summary: string;
}

// API functions
export const getNotes = async (): Promise<Note[]> => {
  const response = await api.get('/notes');
  return response.data;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post('/notes', data);
  return response.data;
};

export const updateNote = async (id: string, data: UpdateNoteData): Promise<Note> => {
  const response = await api.put(`/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export const summarizeNote = async (id: string): Promise<SummarizeResponse> => {
  const response = await api.post(`/notes/${id}/summarize`);
  return response.data;
}; 