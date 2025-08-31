import React, { useState } from 'react';
import EditTaskModal from './EditTaskModal';

const TaskItem = ({ task, updateTask, deleteTask, markAsDone }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    updateTask(task._id, { ...task, completed: !task.completed });
  };

  const handleDelete = () => {
    deleteTask(task._id);
  };

  const handleDone = () => {
    markAsDone(task._id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (updatedTask) => {
    updateTask(task._id, updatedTask);
    setIsEditing(false);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  return (
    <>
      <li>
        <span
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
          }}
          onClick={handleUpdate}
        >
          {task.title}
        </span>
        <button onClick={handleEdit} style={{ marginLeft: '10px' }}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
        <button onClick={handleDone} style={{ marginLeft: '10px' }}>Done</button>
      </li>
      <EditTaskModal
        task={task}
        isOpen={isEditing}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default TaskItem;
