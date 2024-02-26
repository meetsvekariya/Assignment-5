// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; 
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'male' });

  useEffect(() => {
    axios.get(API_BASE_URL)
    .then(response => setTasks(response.data))
    .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleTaskChange = (key, value) => {
    setNewTask({ ...newTask, [key]: value });
  };

  const handleAddTask = () => {
    axios.post(API_BASE_URL, newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', status: 'pending' });
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    axios.put(API_BASE_URL, updatedTask)
      .then(response => {
        setTasks(tasks.map(task => (task.id === taskId ? response.data : task)));
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(API_BASE_URL)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>CRUD-create,read,update,delete</h1>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <div>
              <strong>Title:</strong> {task.title}
            </div>
            <div>
              <strong>Description:</strong> {task.description}
            </div>
            <div>
              <strong>male:</strong> {task.status}
            </div>
            <button onClick={() => handleUpdateTask(task.id, { ...task, status: 'female' })}>female</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Add New Task</h2>
      <div>
        <label>Title:</label>
        <input type="text" value={newTask.title} onChange={(e) => handleTaskChange('title', e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={newTask.description} onChange={(e) => handleTaskChange('description', e.target.value)} />
      </div>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
}

export default App;
