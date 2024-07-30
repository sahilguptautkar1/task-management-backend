import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Tasks';

const router = express.Router();

const taskValidationRules = [
  body('title').isString().notEmpty().withMessage('Title is required and must be a string.'),
  body('description').isString().notEmpty().withMessage('Description is required and must be a string.'),
  body('status')
    .isIn(['To-Do', 'In Progress', 'Done'])
    .withMessage('Status must be one of the following: "To-Do", "In Progress", "Done".'),
];

router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', taskValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status } = req.body;
    const newTask = new Task({ title, description, status });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', taskValidationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title;
    task.description = description;
    task.status = status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
