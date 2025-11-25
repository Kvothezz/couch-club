export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TMDB_KEY: import.meta.env.VITE_TMDB_API_KEY || '',
  TMDB_BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  TMDB_IMAGE_URL: import.meta.env.VITE_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p/w500',
};