import { Request, Response, NextFunction } from 'express';

// Validasi untuk tambah todo baru (POST)
export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { task } = req.body;

  if (!task || typeof task !== 'string') {
    res.status(400).json({ success: false, message: 'Task wajib diisi dan harus berupa string' });
    return;
  }

  next();
};

// Validasi untuk update todo (PUT)
export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { task, is_completed } = req.body;

  // Minimal salah satu harus dikirim
  if (task === undefined && is_completed === undefined) {
    res.status(400).json({ success: false, message: 'Isi minimal task atau is_completed' });
    return;
  }

  // Jika task dikirim, harus berupa string
  if (task !== undefined && typeof task !== 'string') {
    res.status(400).json({ success: false, message: 'Task harus berupa string' });
    return;
  }

  next();
};

// Validasi register user
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    return;
  }

  next();
};

// Validasi login user
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    return;
  }

  next();
};