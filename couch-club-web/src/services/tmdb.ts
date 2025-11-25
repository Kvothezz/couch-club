import axios from 'axios';
import { ENV } from '../config/env';

const tmdb = axios.create({
  baseURL: ENV.TMDB_BASE_URL,
  params: {
    api_key: ENV.TMDB_KEY,
    language: 'pt-BR',
  },
});

export default tmdb;