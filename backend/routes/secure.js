import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';

const router = express.Router();

/**
 * @route   GET /api/secure
 * @desc    Protected route - requires authentication
 * @access  Protected
 */
router.get('/', (req, res) => {
  res.json({
    message: 'This is a protected endpoint - authentication successful!',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /api/secure/profile
 * @desc    Get user profile
 * @access  Protected
 */
router.get('/profile', async (req, res) => {
  try {
    let user = await User.findOne({ keycloakId: req.user.sub });

    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        keycloakId: req.user.sub,
        username: req.user.username,
        email: req.user.email,
        roles: req.user.roles,
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    res.json({
      keycloakInfo: req.user,
      dbProfile: user,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   PUT /api/secure/profile
 * @desc    Update user profile
 * @access  Protected
 */
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, preferences } = req.body;

    let user = await User.findOne({ keycloakId: req.user.sub });

    if (!user) {
      user = await User.create({
        keycloakId: req.user.sub,
        username: req.user.username,
        email: req.user.email,
        firstName,
        lastName,
        preferences,
        roles: req.user.roles,
      });
    } else {
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (preferences) user.preferences = preferences;
      await user.save();
    }

    res.json({
      message: 'Profile updated successfully',
      profile: user,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   GET /api/secure/tasks
 * @desc    Get all tasks for the current user
 * @access  Protected
 */
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.sub }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   POST /api/secure/tasks
 * @desc    Create a new task
 * @access  Protected
 */
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      createdBy: req.user.sub,
    });

    res.status(201).json({ 
      message: 'Task created successfully',
      task 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   PUT /api/secure/tasks/:id
 * @desc    Update a task
 * @access  Protected
 */
router.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.sub 
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    res.json({ 
      message: 'Task updated successfully',
      task 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

/**
 * @route   DELETE /api/secure/tasks/:id
 * @desc    Delete a task
 * @access  Protected
 */
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user.sub 
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ 
      message: 'Task deleted successfully',
      task 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

export default router;
