import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

const API_URL = 'http://localhost:5001/api/tasks';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(API_URL, task);
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error(err);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, updatedTask);
      setTasks(
        tasks.map((task) => (task._id === id ? res.data : task))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <TaskForm addTask={addTask} loading={loading} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <TaskList
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
};

export default App;
