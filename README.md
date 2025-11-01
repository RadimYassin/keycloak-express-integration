# MERN Stack with Keycloak Authentication

A full-stack web application built with MongoDB, Express.js, React, and Node.js (MERN), featuring enterprise-grade authentication and authorization using Keycloak.

## 🚀 Features

### Authentication & Authorization
- ✅ Keycloak integration for secure authentication
- ✅ JWT token validation and refresh
- ✅ Role-based access control (RBAC)
- ✅ Protected routes and API endpoints
- ✅ Admin and user role differentiation

### Backend (Express + Node.js)
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ Custom Keycloak middleware for JWT validation
- ✅ Public and protected API routes
- ✅ Admin-only endpoints
- ✅ CORS configuration
- ✅ Environment-based configuration

### Frontend (React)
- ✅ Modern React with Vite
- ✅ React Router for navigation
- ✅ Keycloak.js integration
- ✅ Protected route components
- ✅ Role-based UI rendering
- ✅ User profile management
- ✅ Task management system
- ✅ Admin dashboard
- ✅ Responsive design with modern CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Docker** (optional, for Keycloak) - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Keycloak Connect
- **Token Handling**: jsonwebtoken
- **HTTP Client**: Axios

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Auth Library**: @react-keycloak/web
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Authentication
- **Provider**: Keycloak 23.x
- **Protocol**: OpenID Connect / OAuth 2.0
- **Token Type**: JWT (RS256)

## 📂 Project Structure

```
mern-keycloak-app/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── keycloak.js          # Keycloak JWT middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Task.js              # Task model
│   ├── routes/
│   │   ├── public.js            # Public endpoints
│   │   ├── secure.js            # Protected endpoints
│   │   └── admin.js             # Admin endpoints
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── Loading.jsx      # Loading component
│   │   │   └── PrivateRoute.jsx # Route guard
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Dashboard
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── Tasks.jsx        # Task management
│   │   │   ├── Admin.jsx        # Admin panel
│   │   │   ├── Unauthorized.jsx # 401 page
│   │   │   └── Forbidden.jsx    # 403 page
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── utils/
│   │   │   └── roles.js         # Role utilities
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── keycloak.js          # Keycloak config
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   └── KEYCLOAK_SETUP.md        # Keycloak setup guide
│
└── README.md                     # This file
```

## 🚦 Getting Started

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd mern-keycloak-app
```

### Step 2: Set Up Keycloak

**Option A: Using Docker (Recommended)**

```bash
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:23.0.3 \
  start-dev
```

**Option B: Standalone Installation**

Download Keycloak from [keycloak.org](https://www.keycloak.org/downloads) and run:
```bash
# Windows
bin\kc.bat start-dev

# Linux/Mac
bin/kc.sh start-dev
```

**Configure Keycloak**

Follow the detailed setup guide: [docs/KEYCLOAK_SETUP.md](docs/KEYCLOAK_SETUP.md)

Quick summary:
1. Access admin console: `http://localhost:8080`
2. Create realm: `mern-realm`
3. Create clients: `mern-backend`, `mern-frontend`
4. Create roles: `user`, `admin`
5. Create users with roles

### Step 3: Set Up MongoDB

**Option A: Using Docker**

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  mongo:latest
```

**Option B: Local Installation**

Install MongoDB Community Server and start the service.

**Verify MongoDB is Running**

```bash
# Windows
mongosh

# Linux/Mac
mongosh
```

### Step 4: Configure Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac

# Edit .env file with your Keycloak client secret
# Get the secret from Keycloak Admin Console:
# Clients -> mern-backend -> Credentials tab
```

**Edit `backend/.env`:**

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/mern-keycloak-db

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=mern-realm
KEYCLOAK_CLIENT_ID=mern-backend
KEYCLOAK_CLIENT_SECRET=<paste-your-client-secret-here>

FRONTEND_URL=http://localhost:3000
```

### Step 5: Configure Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac
```

**Edit `frontend/.env`:**

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=mern-realm
VITE_KEYCLOAK_CLIENT_ID=mern-frontend

VITE_API_URL=http://localhost:5000
```

### Step 6: Run the Application

**Terminal 1 - Backend**

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
✅ Server is running on http://localhost:5000
```

**Terminal 2 - Frontend**

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 7: Test the Application

1. **Open the app**: Navigate to `http://localhost:3000`
2. **Login as Admin**:
   - Username: `admin`
   - Password: `admin123`
   - Access: All features including Admin panel

3. **Login as Regular User**:
   - Username: `testuser`
   - Password: `test123`
   - Access: Dashboard, Profile, Tasks (no Admin)

## 📚 API Endpoints

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public` | Get public information |
| GET | `/api/public/health` | Health check |

### Protected Endpoints (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/secure` | Test protected route |
| GET | `/api/secure/profile` | Get user profile |
| PUT | `/api/secure/profile` | Update user profile |
| GET | `/api/secure/tasks` | Get user's tasks |
| POST | `/api/secure/tasks` | Create a task |
| PUT | `/api/secure/tasks/:id` | Update a task |
| DELETE | `/api/secure/tasks/:id` | Delete a task |

### Admin Endpoints (Requires Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/secure/admin/users` | Get all users |
| GET | `/api/secure/admin/tasks` | Get all tasks |
| GET | `/api/secure/admin/stats` | Get statistics |
| DELETE | `/api/secure/admin/users/:id` | Delete a user |

## 🔒 Authentication Flow

### Login Process

1. User clicks "Login" button
2. Redirected to Keycloak login page
3. User enters credentials
4. Keycloak validates and issues JWT token
5. User redirected back to app with token
6. Token stored in Keycloak.js instance
7. Token automatically sent with API requests

### Token Validation

**Frontend**:
- Keycloak.js manages token refresh automatically
- Token included in Authorization header: `Bearer <token>`

**Backend**:
- Custom middleware validates JWT signature
- Verifies token using Keycloak public key
- Extracts user info and roles
- Attaches user object to request

### Role-Based Access

**Frontend**:
```javascript
// Check if user has admin role
const isAdmin = keycloak?.realmAccess?.roles?.includes('admin');

// Conditionally render UI
{isAdmin && <AdminPanel />}
```

**Backend**:
```javascript
// Protect route with role check
router.get('/admin', 
  keycloak.protect(), 
  keycloak.checkRole('admin'), 
  adminController
);
```

## 🎨 Frontend Features

### Pages

1. **Home/Dashboard**
   - Welcome screen for unauthenticated users
   - Dashboard with stats for authenticated users
   - Quick links to other sections

2. **Profile**
   - Display Keycloak user information
   - Show assigned roles
   - Token expiration info
   - Database profile sync

3. **Tasks**
   - CRUD operations for tasks
   - Filter by status and priority
   - Task assignment and tracking

4. **Admin Panel** (Admin only)
   - User management
   - View all tasks
   - Application statistics
   - Role-based charts

### Components

- **Header**: Navigation with user menu
- **PrivateRoute**: Route guard for protected pages
- **Loading**: Loading state component

## 🔧 Development

### Backend Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

**Backend**:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode
- `MONGODB_URI`: MongoDB connection string
- `KEYCLOAK_URL`: Keycloak server URL
- `KEYCLOAK_REALM`: Keycloak realm name
- `KEYCLOAK_CLIENT_ID`: Backend client ID
- `KEYCLOAK_CLIENT_SECRET`: Backend client secret
- `FRONTEND_URL`: Frontend URL for CORS

**Frontend**:
- `VITE_KEYCLOAK_URL`: Keycloak server URL
- `VITE_KEYCLOAK_REALM`: Keycloak realm name
- `VITE_KEYCLOAK_CLIENT_ID`: Frontend client ID
- `VITE_API_URL`: Backend API URL

## 🐛 Troubleshooting

### Common Issues

**1. Cannot connect to MongoDB**
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (Linux)
sudo systemctl start mongod
```

**2. Keycloak CORS errors**
- Verify Web Origins in Keycloak client settings
- Check client configuration matches .env files

**3. Token validation fails**
- Ensure client secret is correct in backend .env
- Verify Keycloak URL is accessible from backend

**4. Frontend not authenticating**
- Check browser console for errors
- Verify redirect URIs in Keycloak frontend client
- Clear browser cache and cookies

**5. Admin panel not accessible**
- Verify user has admin role in Keycloak
- Check role name matches exactly (case-sensitive)

### Logging

**Backend**: Check console output for detailed logs

**Frontend**: Open browser DevTools console

**Keycloak**: Check Keycloak admin console -> Events

## 📦 Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in .env
2. Use a reverse proxy (Nginx, Apache)
3. Enable HTTPS
4. Use production MongoDB instance
5. Configure proper CORS settings
6. Set secure session secrets

### Frontend Deployment

1. Build the app: `npm run build`
2. Deploy `dist` folder to static host
3. Update environment variables for production Keycloak
4. Configure HTTPS
5. Update redirect URIs in Keycloak

### Keycloak Production

1. Use PostgreSQL/MySQL instead of H2
2. Configure SSL/TLS
3. Set up proper realm and client configs
4. Enable security features
5. Configure clustering for high availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Keycloak](https://www.keycloak.org/) - Identity and Access Management
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://react.dev/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

For issues and questions:
- Check [docs/KEYCLOAK_SETUP.md](docs/KEYCLOAK_SETUP.md)
- Review API endpoints documentation
- Check Keycloak documentation
- Open an issue on GitHub

## 🎯 Next Steps

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add social login (Google, GitHub)
- [ ] Create Docker Compose for full stack
- [ ] Add unit and integration tests
- [ ] Implement refresh token rotation
- [ ] Add audit logging
- [ ] Create user self-service portal

---

**Happy Coding! 🚀**
