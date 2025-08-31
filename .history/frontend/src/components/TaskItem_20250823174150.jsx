import React from 'react';

const TaskItem = ({ task, updateTask, deleteTask }) => {
  const handleUpdate = () => {
    updateTask(task._id, { ...task, completed: !task.completed });
  };

  const handleDelete = () => {
    deleteTask(task._id);
  };

  return (
    <li>
      <span
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
        onClick={handleUpdate}
      >
        {task.title}
      </span>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default TaskItem;
