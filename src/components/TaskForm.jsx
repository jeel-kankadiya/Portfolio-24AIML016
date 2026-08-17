/* TaskForm.jsx — Modal dialog for creating/editing tasks */
import { useState, useEffect } from 'react';

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  completed: false,
};

const TaskForm = ({ isOpen, onClose, onSubmit, editingTask, isSubmitting }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = !!editingTask;

  /* Populate form when editing, reset when opening for create */
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setForm({
          title: editingTask.title || '',
          description: editingTask.description || '',
          priority: editingTask.priority || 'medium',
          completed: editingTask.completed || false,
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePriority = (priority) => {
    setForm((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? '✏️ Edit Task' : '✨ Create New Task'}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Title */}
            <div className="modal-field">
              <label htmlFor="task-title">Task Title *</label>
              <input
                id="task-title"
                type="text"
                name="title"
                placeholder="Enter task title..."
                value={form.title}
                onChange={handleChange}
                className={errors.title ? 'input-error' : ''}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.title && <span className="error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="modal-field">
              <label htmlFor="task-desc">Description (optional)</label>
              <textarea
                id="task-desc"
                name="description"
                rows={3}
                placeholder="Enter task description..."
                value={form.description}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Priority */}
            <div className="modal-field">
              <label>Priority Level</label>
              <div className="priority-selector">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-option ${form.priority === p ? `selected-${p}` : ''}`}
                    onClick={() => handlePriority(p)}
                    disabled={isSubmitting}
                  >
                    {p === 'low' && '🟢'}
                    {p === 'medium' && '🟡'}
                    {p === 'high' && '🔴'}
                    {' '}{p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Completed */}
            <label className="modal-checkbox">
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              Mark as completed
            </label>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (isEditing ? 'Updating...' : 'Creating...')
                : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
