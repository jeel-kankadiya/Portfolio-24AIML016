/* TaskList.jsx — Renders a grid of TaskItem components */
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, deletingId }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-tasks fade-in">
        <span className="empty-icon">📋</span>
        <p className="empty-text">No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task, i) => (
        <TaskItem
          key={task._id}
          task={task}
          index={i}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingId === task._id}
        />
      ))}
    </div>
  );
};

export default TaskList;
