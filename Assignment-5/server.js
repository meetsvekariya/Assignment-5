// server.js
var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const app = express();
const PORT = process.env.PORT || 5000;
const TASKS_FILE = 'tasks.json';

app.use(cors());
app.use(bodyParser.json());
app.get('/api/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE);
    const tasks = JSON.parse(data);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE);
    
    const tasks = JSON.parse(data);

    const newTask = req.body;
    newTask.id = tasks.length + 1;

    tasks.push(newTask);

    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks));

    res.json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/tasks', async (req, res) => {
  try {
    const data = await fs.readFile(TASKS_FILE);
    let tasks = JSON.parse(data);

    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;

    tasks = tasks.map(task => (task.id === taskId ? updatedTask : task));

    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks));

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/tasks/delete', async (req, res) => {
  try {
    console.log('delete wroking')
    const data = await fs.readFile(TASKS_FILE);
    let tasks = JSON.parse(data);

    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);

    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks));

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
