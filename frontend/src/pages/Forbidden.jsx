import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="error-page">
        <Shield size={80} className="error-icon" />
        <h1>403 - Forbidden</h1>
        <p>You don't have permission to access this resource.</p>
        <p className="text-muted">This page requires specific roles that you don't have.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
