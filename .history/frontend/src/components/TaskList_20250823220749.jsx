import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, updateTask, deleteTask, markAsDone }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
          markAsDone={markAsDone}
          markAsDone={markAsDone}
          />
      ))}
    </ul>
  );
};

export default TaskList;
