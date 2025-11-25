import { useEffect, useState } from 'react';
import tmdb from '../../services/tmdb';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Home.css';

function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMovies = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query ? '/search/movie' : '/movie/popular';
      const params = query ? { query: query } : {};

      const response = await tmdb.get(endpoint, { params });
      
      if (response.data && response.data.results) {
        setMovies(response.data.results);
      }
    } catch (err) {
      console.error('Erro TMDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMovies(searchQuery);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>{searchQuery ? `Resultados para: "${searchQuery}"` : 'Filmes Populares'}</h1>
        
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Busque um filme..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </header>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="movie-grid">
          {movies.length > 0 ? (
            movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p className="no-results">Nenhum filme encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;