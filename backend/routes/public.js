import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/public
 * @desc    Public route - no authentication required
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    message: 'This is a public endpoint - no authentication required',
    timestamp: new Date().toISOString(),
    endpoints: {
      public: '/api/public',
      secure: '/api/secure (requires authentication)',
      profile: '/api/secure/profile (requires authentication)',
      tasks: '/api/secure/tasks (requires authentication)',
      admin: '/api/secure/admin (requires admin role)',
    }
  });
});

/**
 * @route   GET /api/public/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
