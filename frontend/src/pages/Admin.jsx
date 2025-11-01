import { useState, useEffect } from 'react';
import { Shield, Users, CheckSquare, BarChart3 } from 'lucide-react';
import { adminAPI } from '../services/api';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'stats') {
        const response = await adminAPI.getStats();
        setStats(response.data.stats);
      } else if (activeTab === 'users') {
        const response = await adminAPI.getUsers();
        setUsers(response.data.users);
      } else if (activeTab === 'tasks') {
        const response = await adminAPI.getTasks();
        setTasks(response.data.tasks);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="container">
      <div className="admin-page">
        <div className="admin-header">
          <Shield size={32} />
          <h1>Admin Panel</h1>
          <span className="admin-badge">Admin Only</span>
        </div>

        {error && (
          <div className="error-card">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="btn btn-sm">Dismiss</button>
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={20} />
            Statistics
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            Users
          </button>
          <button
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare size={20} />
            All Tasks
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="admin-content">
            {activeTab === 'stats' && stats && (
              <div className="stats-section">
                <div className="stat-cards">
                  <div className="stat-card-large">
                    <Users size={40} />
                    <h2>{stats.totalUsers}</h2>
                    <p>Total Users</p>
                  </div>
                  <div className="stat-card-large">
                    <CheckSquare size={40} />
                    <h2>{stats.totalTasks}</h2>
                    <p>Total Tasks</p>
                  </div>
                </div>

                {stats.tasksByStatus && stats.tasksByStatus.length > 0 && (
                  <div className="chart-section">
                    <h3>Tasks by Status</h3>
                    <div className="status-bars">
                      {stats.tasksByStatus.map((item) => (
                        <div key={item._id} className="status-bar-item">
                          <span className="status-label">{item._id}</span>
                          <div className="status-bar">
                            <div
                              className={`status-fill status-${item._id}`}
                              style={{ width: `${(item.count / stats.totalTasks) * 100}%` }}
                            />
                          </div>
                          <span className="status-count">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <h3>All Users ({users.length})</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Last Login</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.roles?.filter(r => !r.startsWith('default')).map(role => (
                              <span key={role} className="role-badge-sm">{role}</span>
                            ))}
                          </td>
                          <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-section">
                <h3>All Tasks ({tasks.length})</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created By</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>
                            <span className={`badge status-${task.status}`}>
                              {task.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge priority-${task.priority}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="code-sm">{task.createdBy.substring(0, 8)}...</td>
                          <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
