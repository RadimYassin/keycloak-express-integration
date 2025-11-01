import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { User, Mail, Shield, Clock, Database } from 'lucide-react';
import { secureAPI } from '../services/api';

const Profile = () => {
  const { keycloak } = useKeycloak();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await secureAPI.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-card">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const userRoles = keycloak.realmAccess?.roles?.filter(
    role => !role.startsWith('default') && !role.startsWith('uma') && !role.startsWith('offline')
  ) || [];

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-header">
          <User size={32} />
          <h1>User Profile</h1>
        </div>

        <div className="profile-sections">
          {/* Keycloak Information */}
          <div className="profile-section">
            <h2>
              <Shield size={24} />
              Keycloak Information
            </h2>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{keycloak.tokenParsed?.preferred_username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{keycloak.tokenParsed?.email || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{keycloak.tokenParsed?.name || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">User ID:</span>
                <span className="info-value code">{keycloak.tokenParsed?.sub}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email Verified:</span>
                <span className="info-value">
                  {keycloak.tokenParsed?.email_verified ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="profile-section">
            <h2>
              <Shield size={24} />
              Roles & Permissions
            </h2>
            <div className="roles-container">
              {userRoles.length > 0 ? (
                userRoles.map((role) => (
                  <span key={role} className={`role-badge ${role === 'admin' ? 'admin' : ''}`}>
                    {role}
                  </span>
                ))
              ) : (
                <p className="text-muted">No custom roles assigned</p>
              )}
            </div>
          </div>

          {/* Database Profile */}
          {profile?.dbProfile && (
            <div className="profile-section">
              <h2>
                <Database size={24} />
                Database Profile
              </h2>
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Database ID:</span>
                  <span className="info-value code">{profile.dbProfile._id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Created:</span>
                  <span className="info-value">
                    {new Date(profile.dbProfile.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Login:</span>
                  <span className="info-value">
                    {new Date(profile.dbProfile.lastLogin).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Token Information */}
          <div className="profile-section">
            <h2>
              <Clock size={24} />
              Token Information
            </h2>
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Issued At:</span>
                <span className="info-value">
                  {new Date((keycloak.tokenParsed?.iat || 0) * 1000).toLocaleString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Expires At:</span>
                <span className="info-value">
                  {new Date((keycloak.tokenParsed?.exp || 0) * 1000).toLocaleString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Time Until Expiry:</span>
                <span className="info-value">
                  {Math.floor(((keycloak.tokenParsed?.exp || 0) * 1000 - Date.now()) / 1000 / 60)} minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
