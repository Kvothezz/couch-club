import { useEffect, useState } from 'react';
import api from '../../services/api';
import tmdb from '../../services/tmdb';
import MovieCard from '../../components/MovieCard/MovieCard';
import { toast } from 'react-toastify';
import './MyLists.css';

interface MovieId {
  tmdbId: number;
  id: string;
}

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

function MyLists() {
  const [wantList, setWantList] = useState<MovieDetails[]>([]);
  const [watchedList, setWatchedList] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetails = async (movieIds: MovieId[]): Promise<MovieDetails[]> => {
    const promises = movieIds.map(movie => 
      tmdb.get(`/movie/${movie.tmdbId}`)
        .then(res => res.data)
        .catch(err => {
          console.error(`Erro ao buscar filme ${movie.tmdbId}:`, err);
          return null;
        })
    );
    const results = await Promise.all(promises);
    return results.filter(movie => movie !== null);
  };

  const loadLists = async () => {
    setLoading(true);
    try {
      const response = await api.get('/lists/my-lists');
      const wantToWatchIds = response.data.find((l: any) => l.name === 'WANT_TO_WATCH')?.movies || [];
      const watchedIds = response.data.find((l: any) => l.name === 'WATCHED')?.movies || [];

      const wantDetails = await fetchMovieDetails(wantToWatchIds);
      const watchedDetails = await fetchMovieDetails(watchedIds);

      setWantList(wantDetails);
      setWatchedList(watchedDetails);

    } catch (error) {
      toast.error('Erro ao carregar suas listas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleRemoveMovie = async (tmdbId: number, listType: 'WANT_TO_WATCH' | 'WATCHED') => {
    try {
      await api.post('/lists/remove-movie', { tmdbId, listType });
      
      if (listType === 'WANT_TO_WATCH') {
        setWantList(prevList => prevList.filter(m => m.id !== tmdbId));
      } else {
        setWatchedList(prevList => prevList.filter(m => m.id !== tmdbId));
      }
      toast.success('Filme removido!');
    } catch (error) {
      toast.error('Erro ao remover filme.');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Carregando suas listas...</div>;

  return (
    <div className="list-container">
      <div className="list-section">
        <h2>Quero Assistir ({wantList.length})</h2>
        {wantList.length === 0 ? (
          <p>Você ainda não adicionou filmes aqui. Vá para a Home e adicione!</p>
        ) : (
          <div className="movie-grid">
            {wantList.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                listType="WANT_TO_WATCH" 
                onRemove={handleRemoveMovie}
              />
            ))}
          </div>
        )}
      </div>

      <div className="list-section">
        <h2>Já Assisti ({watchedList.length})</h2>
        {watchedList.length === 0 ? (
          <p>Você ainda não marcou nenhum filme como assistido.</p>
        ) : (
          <div className="movie-grid">
            {watchedList.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                listType="WATCHED"
                onRemove={handleRemoveMovie}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLists;