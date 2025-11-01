import { useKeycloak } from '@react-keycloak/web';
import { Home as HomeIcon, Lock, Shield, Database } from 'lucide-react';

const Home = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login();
  };

  if (!keycloak?.authenticated) {
    return (
      <div className="container">
        <div className="hero">
          <div className="hero-content">
            <Shield size={80} className="hero-icon" />
            <h1>Welcome to MERN Keycloak App</h1>
            <p className="hero-subtitle">
              A full-stack application with secure authentication and authorization
            </p>
            <button onClick={handleLogin} className="btn btn-primary btn-large">
              Login to Get Started
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <Lock size={40} />
              <h3>Secure Authentication</h3>
              <p>Enterprise-grade security with Keycloak</p>
            </div>
            <div className="feature-card">
              <Shield size={40} />
              <h3>Role-Based Access</h3>
              <p>Fine-grained authorization controls</p>
            </div>
            <div className="feature-card">
              <Database size={40} />
              <h3>MongoDB Integration</h3>
              <p>Scalable data persistence</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <HomeIcon size={32} />
          <h1>Dashboard</h1>
        </div>

        <div className="welcome-card">
          <h2>Welcome back, {keycloak.tokenParsed?.preferred_username}! 👋</h2>
          <p>You are successfully authenticated with Keycloak.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Authentication Status</h3>
            <p className="stat-value success">✓ Authenticated</p>
          </div>
          <div className="stat-card">
            <h3>User ID</h3>
            <p className="stat-value">{keycloak.tokenParsed?.sub?.substring(0, 8)}...</p>
          </div>
          <div className="stat-card">
            <h3>Email</h3>
            <p className="stat-value">{keycloak.tokenParsed?.email || 'Not provided'}</p>
          </div>
          <div className="stat-card">
            <h3>Roles</h3>
            <p className="stat-value">
              {keycloak.realmAccess?.roles?.filter(r => !r.startsWith('default')).length || 0}
            </p>
          </div>
        </div>

        <div className="info-section">
          <h2>Quick Links</h2>
          <div className="quick-links">
            <a href="/profile" className="quick-link-card">
              <h3>View Profile</h3>
              <p>See your user information and roles</p>
            </a>
            <a href="/tasks" className="quick-link-card">
              <h3>Manage Tasks</h3>
              <p>Create and manage your tasks</p>
            </a>
            {keycloak.realmAccess?.roles?.includes('admin') && (
              <a href="/admin" className="quick-link-card admin-card">
                <h3>Admin Panel</h3>
                <p>Manage users and view statistics</p>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
