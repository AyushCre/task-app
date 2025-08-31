import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import './App.css';

const API_URL = 'http://localhost:5001/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL);
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
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

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm addTask={addTask} loading={loading} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
