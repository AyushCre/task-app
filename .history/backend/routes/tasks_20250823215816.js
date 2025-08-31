import { Router } from 'express';
import Task from '../models/Task.js';
import logger from '../utils/logger.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/tasks — list all tasks
router.get('/', asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).sort({ createdAt: -1 });
  logger.info('Tasks fetched successfully', { count: tasks.length });
  res.json(tasks);
}));

// POST /api/tasks — create new task
router.post('/', asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length === 0) {
    throw new AppError('Title is required and cannot be empty', 400);
  }

  if (title.length > 200) {
    throw new AppError('Title cannot exceed 200 characters', 400);
  }

  if (description && description.length > 1000) {
    throw new AppError('Description cannot exceed 1000 characters', 400);
  }

  const task = await Task.create({ 
    title: title.trim(), 
    description: description ? description.trim() : '' 
  });
  
  logger.info('Task created successfully', { taskId: task._id, title: task.title });
  res.status(201).json(task);
}));

// PUT /api/tasks/:id — update title/description/completed
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Validate input
  if (title && (title.trim().length === 0 || title.length > 200)) {
    throw new AppError('Title must be between 1 and 200 characters', 400);
  }

  if (description && description.length > 1000) {
    throw new AppError('Description cannot exceed 1000 characters', 400);
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (completed !== undefined) updateData.completed = completed;

  const updated = await Task.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new AppError('Task not found', 404);
  }

  logger.info('Task updated successfully', { taskId: updated._id });
  res.json(updated);
}));

// PATCH /api/tasks/:id/toggle — flip completed
router.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  task.completed = !task.completed;
  await task.save();

  logger.info('Task completion toggled', { 
    taskId: task._id, 
    newStatus: task.completed 
  });
  res.json(task);
}));

// DELETE /api/tasks/:id — delete
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Task.findByIdAndDelete(id);

  if (!deleted) {
    throw new AppError('Task not found', 404);
  }

  logger.info('Task deleted successfully', { taskId: id });
  res.json({ message: 'Task deleted successfully', id });
}));

// ✅ Export at the very bottom
export default router;
