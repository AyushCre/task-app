// Task Controller
import Task from '../models/taskModel.js';

export const getTasks = async (req, res) => {
  const tasks = await Task.find({});
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description });
  await task.save();
  res.status(201).json(task);
};
