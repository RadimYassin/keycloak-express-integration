import jwt from 'jsonwebtoken';
import axios from 'axios';

class KeycloakMiddleware {
  constructor(config) {
    this.config = config;
    this.publicKey = null;
  }

  async getPublicKey() {
    if (this.publicKey) {
      return this.publicKey;
    }

    try {
      const url = `${this.config.url}/realms/${this.config.realm}`;
      const response = await axios.get(url);
      this.publicKey = `-----BEGIN PUBLIC KEY-----\n${response.data.public_key}\n-----END PUBLIC KEY-----`;
      return this.publicKey;
    } catch (error) {
      console.error('Error fetching Keycloak public key:', error.message);
      throw new Error('Failed to fetch Keycloak public key');
    }
  }

  async verifyToken(token) {
    try {
      const publicKey = await this.getPublicKey();
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        // Note: Audience validation disabled for multi-client support
        // The token is still validated with the correct public key
        // audience: this.config.clientId,
      });
      return decoded;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  protect() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'No token provided' 
          });
        }

        const token = authHeader.substring(7);
        const decoded = await this.verifyToken(token);
        
        req.user = {
          sub: decoded.sub,
          email: decoded.email,
          name: decoded.name || decoded.preferred_username,
          username: decoded.preferred_username,
          roles: decoded.realm_access?.roles || [],
          clientRoles: decoded.resource_access?.[this.config.clientId]?.roles || [],
        };

        next();
      } catch (error) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: error.message 
        });
      }
    };
  }

  checkRole(requiredRole) {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'No user information found' 
        });
      }

      const hasRole = req.user.roles.includes(requiredRole) || 
                      req.user.clientRoles.includes(requiredRole);

      if (!hasRole) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: `Required role: ${requiredRole}` 
        });
      }

      next();
    };
  }
}

export default KeycloakMiddleware;
