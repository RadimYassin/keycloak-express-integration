/**
 * Check if user has a specific role
 */
export const hasRole = (keycloak, role) => {
  return keycloak?.realmAccess?.roles?.includes(role) || false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (keycloak, roles) => {
  return roles.some(role => hasRole(keycloak, role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (keycloak, roles) => {
  return roles.every(role => hasRole(keycloak, role));
};

/**
 * Get user roles
 */
export const getUserRoles = (keycloak) => {
  return keycloak?.realmAccess?.roles || [];
};

/**
 * Check if user is admin
 */
export const isAdmin = (keycloak) => {
  return hasRole(keycloak, 'admin');
};
