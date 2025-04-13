import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL // Set the base URL here
});

// You can add interceptors here if needed (e.g., for auth tokens)

export default instance;