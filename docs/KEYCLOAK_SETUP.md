# Keycloak Setup Guide

This guide will walk you through setting up Keycloak for the MERN stack application.

## Prerequisites

- Docker installed (recommended) OR Keycloak standalone server
- Basic understanding of OAuth 2.0 and OpenID Connect

## Option 1: Using Docker (Recommended)

### 1. Start Keycloak with Docker

```bash
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:23.0.3 \
  start-dev
```

### 2. Access Keycloak Admin Console

- Open your browser and navigate to: `http://localhost:8080`
- Click on "Administration Console"
- Login with:
  - Username: `admin`
  - Password: `admin`

## Option 2: Download Keycloak Standalone

1. Download Keycloak from: https://www.keycloak.org/downloads
2. Extract the archive
3. Navigate to the bin folder
4. Run:
   - Windows: `kc.bat start-dev`
   - Linux/Mac: `./kc.sh start-dev`

## Keycloak Configuration Steps

### Step 1: Create a Realm

1. In the Keycloak Admin Console, hover over the realm dropdown (top-left)
2. Click "Create Realm"
3. Enter the following details:
   - **Realm name**: `mern-realm`
4. Click "Create"

### Step 2: Create Backend Client (for Express API)

1. Click on "Clients" in the left sidebar
2. Click "Create client"
3. **General Settings**:
   - Client type: `OpenID Connect`
   - Client ID: `mern-backend`
   - Name: `MERN Backend API`
   - Click "Next"

4. **Capability config**:
   - Client authentication: `ON`
   - Authorization: `OFF`
   - Authentication flow: 
     - ✓ Standard flow
     - ✓ Direct access grants
   - Click "Next"

5. **Login settings**:
   - Leave defaults
   - Click "Save"

6. **Get Client Secret**:
   - Go to the "Credentials" tab
   - Copy the "Client secret" - you'll need this for your backend `.env` file

### Step 3: Create Frontend Client (for React App)

1. Click "Create client" again
2. **General Settings**:
   - Client type: `OpenID Connect`
   - Client ID: `mern-frontend`
   - Name: `MERN Frontend App`
   - Click "Next"

3. **Capability config**:
   - Client authentication: `OFF` (Public client)
   - Authorization: `OFF`
   - Authentication flow:
     - ✓ Standard flow
     - ✗ Direct access grants (uncheck)
   - Click "Next"

4. **Login settings**:
   - Valid redirect URIs: `http://localhost:3000/*`
   - Valid post logout redirect URIs: `http://localhost:3000/*`
   - Web origins: `http://localhost:3000`
   - Click "Save"

### Step 4: Configure CORS

1. Go to the `mern-backend` client
2. Scroll to "Web origins"
3. Add: `http://localhost:5000`
4. Click "Save"

### Step 5: Create Roles

1. Click "Realm roles" in the left sidebar
2. Click "Create role"
3. Create the following roles:

**Role 1: user**
- Role name: `user`
- Description: `Standard user role`
- Click "Save"

**Role 2: admin**
- Role name: `admin`
- Description: `Administrator role`
- Click "Save"

### Step 6: Create Users

#### Create Admin User

1. Click "Users" in the left sidebar
2. Click "Create new user"
3. Fill in:
   - Username: `admin`
   - Email: `admin@example.com`
   - Email verified: `ON`
   - First name: `Admin`
   - Last name: `User`
4. Click "Create"

5. **Set Password**:
   - Go to the "Credentials" tab
   - Click "Set password"
   - Password: `admin123`
   - Temporary: `OFF`
   - Click "Save"

6. **Assign Roles**:
   - Go to the "Role mapping" tab
   - Click "Assign role"
   - Select "Filter by realm roles"
   - Check both `user` and `admin`
   - Click "Assign"

#### Create Regular User

1. Click "Create new user" again
2. Fill in:
   - Username: `testuser`
   - Email: `testuser@example.com`
   - Email verified: `ON`
   - First name: `Test`
   - Last name: `User`
3. Click "Create"

4. **Set Password**:
   - Go to the "Credentials" tab
   - Click "Set password"
   - Password: `test123`
   - Temporary: `OFF`
   - Click "Save"

5. **Assign Roles**:
   - Go to the "Role mapping" tab
   - Click "Assign role"
   - Select "Filter by realm roles"
   - Check only `user`
   - Click "Assign"

### Step 7: Configure Token Lifespan (Optional)

1. Click "Realm settings" in the left sidebar
2. Go to the "Tokens" tab
3. Configure as needed:
   - Access Token Lifespan: 5 minutes (default)
   - Refresh Token Max Reuse: 0
   - SSO Session Idle: 30 minutes
   - SSO Session Max: 10 hours

### Step 8: Enable CORS for Development

1. Click "Realm settings"
2. Go to the "Security defenses" tab
3. Click "Headers" section
4. Ensure "X-Frame-Options" allows your frontend

## Verify Configuration

### Test Endpoints

1. **Realm Info**:
   ```
   http://localhost:8080/realms/mern-realm
   ```

2. **OpenID Configuration**:
   ```
   http://localhost:8080/realms/mern-realm/.well-known/openid-configuration
   ```

3. **JWKS URI**:
   ```
   http://localhost:8080/realms/mern-realm/protocol/openid-connect/certs
   ```

## Update Application Environment Files

### Backend (.env)

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/mern-keycloak-db

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=mern-realm
KEYCLOAK_CLIENT_ID=mern-backend
KEYCLOAK_CLIENT_SECRET=<YOUR_CLIENT_SECRET_FROM_STEP_2>

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=mern-realm
VITE_KEYCLOAK_CLIENT_ID=mern-frontend

VITE_API_URL=http://localhost:5000
```

## Common Issues and Solutions

### Issue 1: CORS Errors

**Solution**: 
- Ensure Web Origins are set correctly in both clients
- Check that `FRONTEND_URL` matches in backend `.env`

### Issue 2: Invalid Redirect URI

**Solution**:
- Verify redirect URIs in frontend client match exactly
- Include the wildcard: `http://localhost:3000/*`

### Issue 3: Token Validation Failed

**Solution**:
- Ensure backend client has "Client authentication" enabled
- Verify the client secret is correct in backend `.env`

### Issue 4: User Not Authorized

**Solution**:
- Check that roles are assigned to the user
- Verify role names match in code and Keycloak

## Testing Authentication

### Test Admin User
- Username: `admin`
- Password: `admin123`
- Roles: `user`, `admin`
- Can access: All pages including Admin panel

### Test Regular User
- Username: `testuser`
- Password: `test123`
- Roles: `user`
- Can access: Dashboard, Profile, Tasks (NOT Admin)

## Security Best Practices

1. **Production**: Change default admin password
2. **Use HTTPS**: In production, always use HTTPS
3. **Secure Secrets**: Never commit `.env` files
4. **Token Expiry**: Configure appropriate token lifespans
5. **Rate Limiting**: Implement on both Keycloak and backend
6. **Password Policy**: Configure strong password policies in Keycloak

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Securing Applications Guide](https://www.keycloak.org/docs/latest/securing_apps/)
- [Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/)

## Next Steps

After completing this setup:
1. Start MongoDB
2. Start the backend server
3. Start the frontend application
4. Test authentication with both users

See the main README.md for running instructions.
