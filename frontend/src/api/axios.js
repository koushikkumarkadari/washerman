// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Change if your backend runs on a different port
  withCredentials: true, // For cookies (e.g., JWT sessions)
});

export default instance;
