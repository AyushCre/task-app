import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import EditTaskModal from './components/EditTaskModal.jsx';
import './App.css';

const API_URL = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setError(null);
    try {
      const { data } = await axios.get(API_URL);
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(API_URL, task);
      setTasks([...tasks, data]);
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskToUpdate) => {
    setError(null);
    try {
      const { data: updatedTask } = await axios.put(
        `${API_URL}/${taskToUpdate._id}`,
        taskToUpdate
      );
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    setError(null);
    const originalTasks = [...tasks];
    try {
      setTasks(tasks.filter((task) => task._id !== id));
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      setTasks(originalTasks);
      setError('Failed to delete task');
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <TaskForm addTask={addTask} />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onEdit={(task) => setEditingTask(task)}
          onToggleComplete={(task) =>
            updateTask({ ...task, completed: !task.completed })
          }
        />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updatedTask) => {
            updateTask(updatedTask);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default App;