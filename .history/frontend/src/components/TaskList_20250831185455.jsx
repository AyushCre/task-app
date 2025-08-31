import React from 'react';

const TaskList = ({ tasks, onDelete, onEdit, onToggleComplete }) => {
  if (tasks.length === 0) {
    return <p>No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task._id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-info">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
            />
            <span className="task-title">{task.title}</span>
          </div>
          <div className="task-actions">
            <button className="btn-edit" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;