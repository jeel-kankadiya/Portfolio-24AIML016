/* Tasks.jsx — Full CRUD Task Management page (premium design) */
import { useState, useEffect, useCallback } from 'react';
import './Tasks.css';

import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Spinner      from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import TaskForm     from '../components/TaskForm';
import TaskList     from '../components/TaskList';
import { ToastContainer } from '../components/Toast';

const Tasks = () => {
  /* ── State ── */
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId]     = useState(null);
  const [toasts, setToasts]             = useState([]);

  /* Filters */
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortOrder, setSortOrder]   = useState('newest');

  /* ── Toast helpers ── */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Fetch all tasks on mount ── */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /* ── CREATE ── */
  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      const newTask = await createTask(formData);
      setTasks((prev) => [newTask, ...prev]);
      setIsModalOpen(false);
      addToast('Task created and persisted in MongoDB!');
    } catch (err) {
      addToast(err.message || 'Failed to create task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── UPDATE ── */
  const handleUpdate = async (formData) => {
    if (!editingTask) return;
    try {
      setIsSubmitting(true);
      const updated = await updateTask(editingTask._id, formData);
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
      setEditingTask(null);
      setIsModalOpen(false);
      addToast('Task updated successfully!');
    } catch (err) {
      addToast(err.message || 'Failed to update task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      addToast('Task deleted successfully!');
    } catch (err) {
      addToast(err.message || 'Failed to delete task.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Edit mode ── */
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  /* ── Computed stats ── */
  const totalCount     = tasks.length;
  const pendingCount   = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const highCount      = tasks.filter((t) => t.priority === 'high').length;

  /* ── Filtered + sorted tasks ── */
  const filtered = tasks
    .filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'completed' && t.completed) ||
        (filterStatus === 'pending' && !t.completed);
      const matchesPriority =
        filterPriority === 'all' || t.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === 'title')  return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <main className="page fade-in">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="tasks-header">
        <h1>Task Management</h1>
        <p className="tasks-subtitle">
          Manage tasks in real time backed by your Node.js + Express REST API and
          MongoDB Atlas database.
        </p>
      </div>

      {/* Top Bar */}
      <div className="tasks-topbar">
        <span className="connection-badge">
          <span className="connection-dot" />
          Connected to Node.js &amp; MongoDB
        </span>
        <button className="btn-new-task" onClick={handleNewTask}>
          ➕ New Task
        </button>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-info">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{totalCount}</div>
          </div>
          <div className="stat-icon stat-icon-total">📋</div>
        </div>
        <div className="stat-box">
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
          <div className="stat-icon stat-icon-pending">📦</div>
        </div>
        <div className="stat-box">
          <div className="stat-info">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completedCount}</div>
          </div>
          <div className="stat-icon stat-icon-completed">✅</div>
        </div>
        <div className="stat-box">
          <div className="stat-info">
            <div className="stat-label">High Priority</div>
            <div className="stat-value">{highCount}</div>
          </div>
          <div className="stat-icon stat-icon-high">🔥</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-search">
          <span className="filter-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="filter-select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="filter-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">By Title</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <Spinner />}

      {/* Error */}
      {!loading && error && <ErrorMessage message={error} />}

      {/* Task List */}
      {!loading && !error && (
        <TaskList
          tasks={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      {/* Modal Form */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        editingTask={editingTask}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default Tasks;
