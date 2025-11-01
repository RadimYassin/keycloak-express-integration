import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import KeycloakMiddleware from './middleware/keycloak.js';
import publicRoutes from './routes/public.js';
import secureRoutes from './routes/secure.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize Keycloak Middleware
const keycloak = new KeycloakMiddleware({
  url: process.env.KEYCLOAK_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Keycloak Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      public: '/api/public',
      secure: '/api/secure',
      admin: '/api/secure/admin',
    },
    documentation: 'See README.md for API documentation',
  });
});

// Public routes (no authentication required)
app.use('/api/public', publicRoutes);

// Protected routes (authentication required)
app.use('/api/secure', keycloak.protect(), secureRoutes);

// Admin routes (authentication + admin role required)
app.use('/api/secure/admin', keycloak.protect(), keycloak.checkRole('admin'), adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 MERN Keycloak Backend Server                ║
║                                                   ║
║   Port: ${PORT}                                      ║
║   Environment: ${process.env.NODE_ENV || 'development'}                     ║
║   MongoDB: ${process.env.MONGODB_URI?.includes('localhost') ? 'Local' : 'Remote'}                               ║
║   Keycloak: ${process.env.KEYCLOAK_URL}          ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/public`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
