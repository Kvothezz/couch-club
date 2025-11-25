import { useState, useEffect } from 'react';
import tmdb from '../../services/tmdb';
import MovieCard from '../MovieCard/MovieCard';
import './MatchResult.css';

interface MatchData {
  directMatches: number[];
  affinityScore: number;
}


interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface MatchResultProps {
  result: MatchData;
  onReset: () => void;
}

const getJaccardDiagnosis = (score: number) => {
  if (score < 0.3) {
    return {
      emoji: '🧊',
      title: `Compatibilidade Baixa (${(score * 100).toFixed(0)}%)`,
      text: 'Vocês são de mundos diferentes! Hoje não é dia de arriscar, foquem nos filmes do "Match Direto".',
    };
  }
  if (score < 0.7) {
    return {
      emoji: '⚖️',
      title: `Compatibilidade Média (${(score * 100).toFixed(0)}%)`,
      text: 'Vocês têm gostos variados. Se a lista de Match estiver vazia, tentem negociar e ceder um pouco!',
    };
  }
  return {
    emoji: '🔥',
    title: `Compatibilidade Alta (${(score * 100).toFixed(0)}%)`,
    text: 'Almas gêmeas do cinema! Podem confiar de olhos fechados na lista um do outro.',
  };
};

function MatchResult({ result, onReset }: MatchResultProps) {
  const [matchedMovies, setMatchedMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const diagnosis = getJaccardDiagnosis(result.affinityScore);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const promises = result.directMatches.map(id =>
        tmdb.get(`/movie/${id}`).then(res => res.data)
      );
      const movies = await Promise.all(promises);
      setMatchedMovies(movies);
      setLoading(false);
    };

    if (result.directMatches.length > 0) {
      fetchMovies();
    } else {
      setLoading(false);
    }
  }, [result.directMatches]);

  return (
    <div className="result-container">
      <button onClick={onReset} className="back-btn">← Voltar e criar nova sessão</button>
      
      <div className="diagnosis-card">
        <span className="diagnosis-emoji">{diagnosis.emoji}</span>
        <h2>{diagnosis.title}</h2>
        <p>{diagnosis.text}</p>
      </div>


      <div className="match-list">
        <h2>Match Direto ({matchedMovies.length})</h2>
        {loading ? (
          <p>Buscando detalhes dos filmes...</p>
        ) : matchedMovies.length > 0 ? (
          <div className="movie-grid">
            {matchedMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p>Nenhum filme em comum na lista "Quero Assistir". Usem o Score de Afinidade para negociar!</p>
        )}
      </div>
    </div>
  );
}

export default MatchResult;