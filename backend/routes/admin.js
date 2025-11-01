import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

/**
 * @route   GET /api/secure/admin/users
 * @desc    Get all users (admin only)
 * @access  Protected (Admin)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ 
      count: users.length,
      users 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   GET /api/secure/admin/tasks
 * @desc    Get all tasks (admin only)
 * @access  Protected (Admin)
 */
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ 
      count: tasks.length,
      tasks 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   GET /api/secure/admin/stats
 * @desc    Get application statistics (admin only)
 * @access  Protected (Admin)
 */
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalTasks,
        tasksByStatus,
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   DELETE /api/secure/admin/users/:id
 * @desc    Delete a user (admin only)
 * @access  Protected (Admin)
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also delete all tasks created by this user
    await Task.deleteMany({ createdBy: user.keycloakId });

    res.json({ 
      message: 'User and associated tasks deleted successfully',
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

export default router;
