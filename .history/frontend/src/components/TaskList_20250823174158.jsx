import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, updateTask, deleteTask }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
