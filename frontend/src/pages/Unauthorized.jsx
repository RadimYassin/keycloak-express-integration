import { useKeycloak } from '@react-keycloak/web';
import { Lock } from 'lucide-react';

const Unauthorized = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <div className="container">
      <div className="error-page">
        <Lock size={80} className="error-icon" />
        <h1>401 - Unauthorized</h1>
        <p>You need to be logged in to access this page.</p>
        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
