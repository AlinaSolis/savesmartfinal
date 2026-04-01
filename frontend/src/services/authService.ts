// src/services/authService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_AUTH_API;

console.log("AUTH API:", API_URL); // debug

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

//LOGIN
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', {
    email,
    password,
  });

  return response.data;
};

//Registro
export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/register', {
    name,
    email,
    password,
  });

  return response.data;
};

// 👤 USER (opcional)
export const getUser = async (token: string) => {
  const response = await api.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export default api;