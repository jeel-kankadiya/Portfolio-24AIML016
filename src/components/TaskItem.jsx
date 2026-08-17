/* TaskItem.jsx — Individual task card matching reference design */
import { useState } from 'react';

const PRIORITY_MAP = {
  low:    { label: 'Low',    pill: 'pill-low',    accent: 'accent-low' },
  medium: { label: 'Medium', pill: 'pill-medium', accent: 'accent-medium' },
  high:   { label: 'High',   pill: 'pill-high',   accent: 'accent-high' },
};

const TaskItem = ({ task, index, onEdit, onDelete, isDeleting }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;

  const handleDeleteClick = () => setShowConfirm(true);
  const handleConfirmDelete = () => {
    setShowConfirm(false);
    onDelete(task._id);
  };
  const handleCancelDelete = () => setShowConfirm(false);

  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <>
      <article
        className={`task-card fade-in stagger ${task.completed ? 'task-completed' : ''}`}
        style={{ '--i': index }}
      >
        {/* Top accent bar */}
        <div className={`task-accent ${priority.accent}`} />

        <div className="task-card-body">
          {/* Priority + Status row */}
          <div className="task-card-top">
            <span className={`task-priority-pill ${priority.pill}`}>
              {priority.label.toUpperCase()}
            </span>
            <span className={`task-status-pill ${task.completed ? 'status-done-pill' : 'status-pending-pill'}`}>
              {task.completed ? '✅' : '⏳'}
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>

          {/* Title */}
          <h3 className="task-card-title">{task.title}</h3>

          {/* Description */}
          {task.description && (
            <p className="task-card-desc">{task.description}</p>
          )}
        </div>

        {/* Footer */}
        <div className="task-card-bottom">
          <span className="task-date">
            📅 {createdDate}
          </span>
          <div className="task-actions">
            <button
              className="task-btn task-btn-edit"
              onClick={() => onEdit(task)}
              disabled={isDeleting}
              title="Edit task"
            >
              ✏️ Edit
            </button>
            <button
              className="task-btn task-btn-delete"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Delete task"
            >
              {isDeleting ? '⏳' : '🗑️'} Delete
            </button>
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay" onClick={handleCancelDelete}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-text">
              Are you sure you want to delete<br />
              <strong>"{task.title}"</strong>?
            </p>
            <div className="confirm-actions">
              <button
                className="btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="btn-modal-cancel"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
