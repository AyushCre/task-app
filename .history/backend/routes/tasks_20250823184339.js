import { Router } from 'express';
import Task from '../models/Task.js';

const router = Router();

// GET /api/tasks — list all tasks
router.get('/', async (req, res) => {
try {
const tasks = await Task.find({}).sort({ createdAt: -1 });
res.json(tasks);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
});

// POST /api/tasks — create new task
router.post('/', async (req, res) => {
try {
const { title, description } = req.body;
if (!title) return res.status(400).json({ message: 'Title is required' });
const task = await Task.create({ title, description });
res.status(201).json(task);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
});

// PUT /api/tasks/:id — update title/description/completed
router.put('/:id', async (req, res) => {
try {
const { id } = req.params;
const { title, description, completed } = req.body;
const updated = await Task.findByIdAndUpdate(
id,
{ $set: { title, description, completed } },
{ new: true, runValidators: true }
);
if (!updated) return res.status(404).json({ message: 'Task not found' });
res.json(updated);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
});

// PATCH /api/tasks/:id/toggle — flip completed
router.patch('/:id/toggle', async (req, res) => {
try {
const { id } = req.params;
const task = await Task.findById(id);
if (!task) return res.status(404).json({ message: 'Task not found' });
task.completed = !task.completed;
await task.save();
res.json(task);
} catch (err) {
res.status(500).json({ message: 'Server error', error: err.message });
}
});

// DELETE /api/tasks/:id — delete
router.delete('/:id', async (req, res) => {
try {
const { id } = req.params;
const deleted = await Task.findByIdAndDelete(id);
export default router;