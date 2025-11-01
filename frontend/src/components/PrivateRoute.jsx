import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles = [] }) => {
  const { keycloak } = useKeycloak();

  const isAuthenticated = keycloak?.authenticated;

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check roles if specified
  if (roles.length > 0) {
    const hasRequiredRole = roles.some(role => 
      keycloak?.realmAccess?.roles?.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
