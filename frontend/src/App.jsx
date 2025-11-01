import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import { setAuthToken } from './services/api';
import Header from './components/Header';
import Loading from './components/Loading';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Admin from './pages/Admin';
import Unauthorized from './pages/Unauthorized';
import Forbidden from './pages/Forbidden';
import './App.css';

const App = () => {
  const handleTokens = (tokens) => {
    if (tokens?.token) {
      setAuthToken(tokens.token);
    }
  };

  const handleEvent = (event, error) => {
    if (event === 'onAuthSuccess') {
      console.log('✅ Authentication successful');
    } else if (event === 'onAuthError') {
      console.error('❌ Authentication error:', error);
    } else if (event === 'onAuthRefreshSuccess') {
      console.log('🔄 Token refreshed');
    } else if (event === 'onTokenExpired') {
      console.log('⏰ Token expired, refreshing...');
      keycloak.updateToken(30);
    }
  };

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onTokens={handleTokens}
      onEvent={handleEvent}
      initOptions={{
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      }}
      LoadingComponent={<Loading />}
    >
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <Tasks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={['admin']}>
                    <Admin />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ReactKeycloakProvider>
  );
};

export default App;
