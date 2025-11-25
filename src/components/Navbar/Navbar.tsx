import { Link, useNavigate,useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('couch_token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/app">🛋️ Couch Club</Link>
      </div>
      
      <ul className="navbar-links">        
        <li className={isActive('/app')}>
          <Link to="/app">Filmes</Link>
        </li>

        <li className={isActive('/app/my-lists')}>
          <Link to="/app/my-lists">Listas</Link>
        </li>

        <li className={isActive('/app/match')}>
          <Link to="/app/match" className="match-link">Match</Link>
        </li>
      </ul>

      <button onClick={handleLogout} className="logout-btn">Sair</button>
    </nav>
  );
}

export default Navbar;