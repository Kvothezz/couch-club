import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      toast.error('As senhas não conferem.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      
      toast.success('Cadastro realizado com sucesso! Faça o login.');
      navigate('/login');

    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Este e-mail já está em uso.');
        toast.error('Este e-mail já está em uso.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container"> 
      <div className="login-card">
        <h2 className="login-title">Criar Conta</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nome</label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como seus amigos te chamam?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Pelo menos 6 caracteres"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>

        <p className="register-link">
          Já tem uma conta? <Link to="/login">Faça o login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;