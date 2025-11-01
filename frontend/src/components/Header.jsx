import { useKeycloak } from '@react-keycloak/web';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';
import { isAdmin } from '../utils/roles';

const Header = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleLogout = () => {
    keycloak.logout();
  };

  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Shield size={28} />
            <h1>MERN Keycloak App</h1>
          </div>

          {keycloak?.authenticated ? (
            <nav className="nav">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/tasks" className="nav-link">Tasks</Link>
              {isAdmin(keycloak) && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
            </nav>
          ) : null}

          <div className="auth-section">
            {keycloak?.authenticated ? (
              <>
                <div className="user-info">
                  <User size={20} />
                  <span>{keycloak.tokenParsed?.preferred_username}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="btn btn-primary">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
