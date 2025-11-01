# Quick Start Guide

Get the MERN Keycloak application up and running in minutes!

## Prerequisites Checklist

- [ ] Node.js (v18+) installed
- [ ] Docker installed (or MongoDB + Keycloak separately)
- [ ] Git installed
- [ ] Terminal/Command Prompt access

## Option 1: Quick Start with Docker (Recommended)

### 1. Start Infrastructure

```bash
# Start Keycloak and MongoDB
docker-compose up -d

# Wait 30 seconds for services to start
```

### 2. Configure Keycloak (One-time setup)

1. Open http://localhost:8080
2. Login with `admin` / `admin`
3. Follow the detailed setup in [docs/KEYCLOAK_SETUP.md](docs/KEYCLOAK_SETUP.md)

**Quick Summary:**
- Create realm: `mern-realm`
- Create client: `mern-backend` (confidential)
- Create client: `mern-frontend` (public)
- Create roles: `user`, `admin`
- Create user: `admin` with both roles
- Create user: `testuser` with user role

### 3. Configure Backend

```bash
cd backend
npm install
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Linux/Mac
```

Edit `backend/.env` and add your Keycloak client secret from:
Keycloak → Clients → mern-backend → Credentials tab

### 4. Configure Frontend

```bash
cd frontend
npm install
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Linux/Mac
```

No changes needed to `.env` if using default ports.

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Keycloak: http://localhost:8080
- MongoDB UI: http://localhost:8081 (admin/admin)

## Option 2: Manual Setup (Without Docker)

### 1. Install MongoDB

Download and install from https://www.mongodb.com/try/download/community

**Windows:**
```bash
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 2. Install Keycloak

Download from https://www.keycloak.org/downloads

**Run Keycloak:**
```bash
# Windows
bin\kc.bat start-dev

# Linux/Mac
bin/kc.sh start-dev
```

Set admin credentials:
- Username: admin
- Password: admin

### 3. Follow Steps 2-6 from Option 1

## Test Accounts

### Admin User
- **Username:** admin
- **Password:** admin123
- **Access:** Full access including admin panel

### Regular User
- **Username:** testuser
- **Password:** test123
- **Access:** Dashboard, Profile, Tasks only

## Verify Everything Works

### 1. Check Services

```bash
# Check if all services are running
docker ps

# Should see: keycloak, mongodb, mongo-express
```

### 2. Test Backend

```bash
curl http://localhost:5000/api/public/health
```

Expected response:
```json
{"status":"OK","timestamp":"...","uptime":123}
```

### 3. Test Frontend

1. Open http://localhost:3000
2. Click "Login"
3. Login with admin/admin123
4. You should see the dashboard

### 4. Test Protected Routes

1. Navigate to "Profile" - should show user info
2. Navigate to "Tasks" - should load tasks page
3. Navigate to "Admin" - should load admin panel (only for admin)

### 5. Test API Authentication

Get a token from the browser console:
```javascript
console.log(keycloak.token)
```

Test with curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/secure
```

## Common Issues

### Services won't start

```bash
# Check if ports are in use
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :27017
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :8080
lsof -i :27017
lsof -i :3000
lsof -i :5000
```

### Docker issues

```bash
# Reset everything
docker-compose down -v
docker-compose up -d
```

### Can't login

1. Check Keycloak is running: http://localhost:8080
2. Verify user exists in Keycloak admin console
3. Check redirect URIs in frontend client: `http://localhost:3000/*`

### Backend can't connect to MongoDB

```bash
# Check MongoDB is running
docker ps | grep mongodb

# Or if using local MongoDB
mongosh
```

### Frontend shows CORS errors

1. Check `FRONTEND_URL` in backend `.env`
2. Verify Web Origins in Keycloak clients
3. Restart backend server

## Development Workflow

### Making Changes

**Backend changes:**
- Server auto-restarts with nodemon
- Just save your files

**Frontend changes:**
- Vite hot-reloads automatically
- Changes appear instantly

### Debugging

**Backend:**
```bash
# Add console.log() statements
# View in terminal running backend
```

**Frontend:**
- Use browser DevTools console
- React DevTools extension recommended

**Database:**
- Use MongoDB Compass: mongodb://localhost:27017
- Or Mongo Express: http://localhost:8081

### Testing Different Roles

1. Logout from current user
2. Login with different account
3. Admin can access all features
4. Regular user cannot access admin panel

## Stopping the Application

### With Docker

```bash
# Stop services but keep data
docker-compose stop

# Stop and remove everything
docker-compose down

# Stop and remove including data
docker-compose down -v
```

### Without Docker

Press `Ctrl+C` in each terminal window

Stop MongoDB:
```bash
# Windows
net stop MongoDB

# Linux
sudo systemctl stop mongod
```

Stop Keycloak:
Press `Ctrl+C` in Keycloak terminal

## Next Steps

1. ✅ Read the full README.md
2. ✅ Check API documentation in docs/API_DOCUMENTATION.md
3. ✅ Explore the admin panel features
4. ✅ Try creating tasks
5. ✅ Customize the application

## Need Help?

- **Detailed Setup:** See [README.md](README.md)
- **Keycloak Config:** See [docs/KEYCLOAK_SETUP.md](docs/KEYCLOAK_SETUP.md)
- **API Reference:** See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   Keycloak   │      │   Express   │
│  (Port 3000)│      │  (Port 8080) │      │ (Port 5000) │
└─────────────┘      └──────────────┘      └─────────────┘
      │                      │                      │
      │                      │                      │
      │              JWT Token Auth                 │
      │                      │                      │
      └──────────────────────┼──────────────────────┘
                             │
                             ▼
                     ┌──────────────┐
                     │   MongoDB    │
                     │ (Port 27017) │
                     └──────────────┘
```

**Flow:**
1. User logs in via Keycloak
2. Keycloak issues JWT token
3. React stores token
4. React sends requests to Express with token
5. Express validates token with Keycloak
6. Express queries MongoDB
7. Response sent back to React

---

**Ready to code? Start customizing and building! 🚀**
