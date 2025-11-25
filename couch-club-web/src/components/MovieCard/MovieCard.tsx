import { useState } from 'react';
import api from '../../services/api'; 
import { toast } from 'react-toastify';
import './MovieCard.css';

interface MovieProps {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: MovieProps;
  listType?: 'WANT_TO_WATCH' | 'WATCHED';
  onRemove?: (tmdbId: number, listType: 'WANT_TO_WATCH' | 'WATCHED') => void;
}

const imageUrl = import.meta.env.VITE_TMDB_IMAGE_URL;

function MovieCard({ movie, listType, onRemove }: MovieCardProps) {
  const [loading, setLoading] = useState(false);

  const addToList = async (type: 'WANT_TO_WATCH' | 'WATCHED') => {
    setLoading(true);
    try {
      await api.post('/lists/add-movie', {
        tmdbId: movie.id,
        listType: type,
      });
      toast.success(`Adicionado à lista ${type === 'WATCHED' ? 'Já Vi' : 'Quero Ver'}!`);
      
    } catch (error: any) {
      
      if (error.response?.status === 409) {
        toast.info('Este filme já está na sua lista.');
      } else {
        toast.error('Erro ao adicionar filme.');
      }

    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    if (onRemove && listType) {
      onRemove(movie.id, listType);
    }
  };

  return (
    <div className="movie-card">
      <img 
        src={movie.poster_path ? `${imageUrl}${movie.poster_path}` : 'https://placehold.co/500x750?text=Sem+Imagem'} 
        alt={movie.title} 
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <span className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</span>
      </div>

      <div className="movie-actions">
        {onRemove && listType ? (
          <button onClick={handleRemove} className="btn-remove" title="Remover da lista">
             Remover
          </button>
        ) : (
          <>
            <button onClick={() => addToList('WANT_TO_WATCH')} disabled={loading} className="btn-want" title="Adicionar à lista Quero Ver">
              Quero
            </button>
            <button onClick={() => addToList('WATCHED')} disabled={loading} className="btn-watched" title="Marcar como Já Visto">
              Já Vi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieCard;