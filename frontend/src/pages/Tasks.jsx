import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { secureAPI } from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await secureAPI.getTasks();
      setTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await secureAPI.updateTask(editingTask._id, formData);
      } else {
        await secureAPI.createTask(formData);
      }
      setFormData({ title: '', description: '', priority: 'medium', status: 'pending' });
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await secureAPI.deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', priority: 'medium', status: 'pending' });
    setShowForm(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="tasks-page">
        <div className="tasks-header">
          <div>
            <CheckSquare size={32} />
            <h1>My Tasks</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            <Plus size={20} />
            New Task
          </button>
        </div>

        {error && (
          <div className="error-card">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="btn btn-sm">Dismiss</button>
          </div>
        )}

        {showForm && (
          <div className="task-form-card">
            <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare size={64} />
            <h2>No tasks yet</h2>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-actions">
                    <button onClick={() => handleEdit(task)} className="btn-icon">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="btn-icon danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta">
                  <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="task-footer">
                  <span className="text-muted">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
