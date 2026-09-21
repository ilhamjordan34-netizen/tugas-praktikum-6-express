import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Akses ditolak, token tidak ditemukan!' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_bebas';
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Ambil id dari token (menangani baik properti userId maupun id)
    res.locals.userId = decoded.userId || decoded.id;

    if (!res.locals.userId) {
      res.status(401).json({ success: false, message: 'Token tidak valid (User ID kosong).' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluwarsa.' });
  }
};