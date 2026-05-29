import { Todo } from '../models/Todo.js';
import { AppError } from '../utils/AppError.js';

function mapTodo(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    completed: doc.completed,
    priority: doc.priority,
    dueDate: doc.dueDate,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function buildFilter(userId, filter) {
  const base = { user: userId };
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  switch (filter) {
    case 'active':
      return { ...base, completed: false };
    case 'completed':
      return { ...base, completed: true };
    case 'overdue':
      return {
        ...base,
        completed: false,
        dueDate: { $lt: now },
      };
    default:
      return base;
  }
}

export async function listTodos(req, res, next) {
  try {
    const { search = '', filter = 'all', sort = '-createdAt' } = req.query;
    const query = buildFilter(req.user.id, filter);

    if (search && String(search).trim()) {
      const s = String(search).trim();
      const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
      ];
    }

    const isPrioritySort = sort === 'priority' || sort === '-priority';
    const mongoSort = isPrioritySort ? { createdAt: -1 } : sort;

    let todos = await Todo.find(query).sort(mongoSort).lean();

    // Mongoose enum string order is not meaningful for priority; sort in-memory.
    if (sort === 'priority') {
      const weight = { high: 0, medium: 1, low: 2 };
      todos = [...todos].sort((a, b) => weight[a.priority] - weight[b.priority]);
    } else if (sort === '-priority') {
      const weight = { high: 0, medium: 1, low: 2 };
      todos = [...todos].sort((a, b) => weight[b.priority] - weight[a.priority]);
    }

    res.json({ success: true, data: { todos: todos.map(mapTodo) } });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const userId = req.user.id;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const [total, completed, pending, overdue] = await Promise.all([
      Todo.countDocuments({ user: userId }),
      Todo.countDocuments({ user: userId, completed: true }),
      Todo.countDocuments({ user: userId, completed: false }),
      Todo.countDocuments({
        user: userId,
        completed: false,
        dueDate: { $lt: now },
      }),
    ]);

    const byPriority = await Todo.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const priorityMap = { low: 0, medium: 0, high: 0 };
    for (const row of byPriority) {
      if (row._id && priorityMap[row._id] !== undefined) {
        priorityMap[row._id] = row.count;
      }
    }

    res.json({
      success: true,
      data: {
        stats: { total, completed, pending, overdue, byPriority: priorityMap },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createTodo(req, res, next) {
  try {
    const { title, description = '', priority = 'medium', dueDate = null, completed = false } = req.body;

    const todo = await Todo.create({
      user: req.user.id,
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: Boolean(completed),
    });

    res.status(201).json({ success: true, data: { todo: mapTodo(todo) } });
  } catch (err) {
    next(err);
  }
}

export async function updateTodo(req, res, next) {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return next(new AppError('Todo not found', 404));
    }

    const { title, description, priority, dueDate, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) {
      todo.dueDate = dueDate === null || dueDate === '' ? null : new Date(dueDate);
    }
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json({ success: true, data: { todo: mapTodo(todo) } });
  } catch (err) {
    next(err);
  }
}

export async function deleteTodo(req, res, next) {
  try {
    const result = await Todo.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) {
      return next(new AppError('Todo not found', 404));
    }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
}
