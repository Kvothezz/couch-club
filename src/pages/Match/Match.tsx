import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './Match.css'; 
import MatchResult from '../../components/MatchResult/MatchResult';

interface MatchData {
  directMatches: number[];
  affinityScore: number;
}

interface SessionStatus {
  creatorUserId: string;
  status: 'pending' | 'completed';
  result: MatchData | null;
}

function Match() {
  const [sessionCode, setSessionCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [matchResult, setMatchResult] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(false);

  const pollIntervalRef = useRef<number | null>(null);

  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const response = await api.post('/match/create');
      setSessionCode(response.data.sessionCode);
      toast.success('Sessão criada! Envie o código para seu amigo.');
      startPolling(response.data.sessionCode); 
    } catch (error) {
      toast.error('Erro ao criar sessão.');
      setLoading(false);
    }
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.length < 5) {
      toast.warn('Código inválido.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`/match/join/${inputCode.toUpperCase()}`);
      setMatchResult(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Sessão não encontrada ou expirada.');
      } else {
        toast.error('Erro ao entrar na sessão.');
      }
      setLoading(false);
    }
  };

  const startPolling = (code: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = window.setInterval(async () => {
      try {
        const response = await api.get<SessionStatus>(`/match/status/${code}`);
        
        if (response.data.status === 'completed' && response.data.result) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setLoading(false);
          setMatchResult(response.data.result);
          toast.success('Match realizado!');
        }
      } catch (error) {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setLoading(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  if (matchResult) {
    return (
      <MatchResult 
        result={matchResult} 
        onReset={() => {
          setMatchResult(null);
          setSessionCode('');
          setInputCode('');
        }}
      />
    );
  }

  return (
    <div className="match-container">
      <h1>Iniciar um Match</h1>
      <p>Crie uma sessão ou entre em uma com o código do seu amigo.</p>

      <div className="match-sections">
        <div className="match-section">
          <h2>Crie uma Sessão</h2>
          <button 
            onClick={handleCreateSession} 
            className="create-btn" 
            disabled={loading}
          >
            {loading && sessionCode ? 'Aguardando amigo...' : 'Gerar Código'}
          </button>
          
          {sessionCode && (
            <div className="session-code">
              <p>Envie este código:</p>
              <span>{sessionCode}</span>
              {loading && <p style={{ marginTop: 10 }}><i>Verificando a cada 3s...</i></p>}
            </div>
          )}
        </div>

        <div className="match-section">
          <h2>Entrar em uma Sessão</h2>
          <form className="join-form" onSubmit={handleJoinSession}>
            <input
              type="text"
              className="join-input"
              placeholder="CÓDIGO"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              maxLength={6}
            />
            <button 
              type="submit" 
              className="join-btn" 
              disabled={loading || sessionCode.length > 0}
            >
              {loading ? 'Entrando...' : 'Dar Match!'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Match;