import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db'; // sesuaikan jika namanya database.ts (misal: '../config/database')

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Cek apakah username sudah ada
    const [existingUsers]: any = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({ success: false, message: 'Username sudah digunakan!' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ success: true, message: 'Register berhasil! Silakan login.' });
  } catch (error: any) {
    console.error('Error Register:', error);
    res.status(500).json({ success: false, message: 'Error server.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Cari user di database
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      res.status(400).json({ success: false, message: 'Username atau password salah!' });
      return;
    }

    const user = users[0];

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: 'Username atau password salah!' });
      return;
    }

    // Buat JWT Token
    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_bebas';
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token: token
    });
  } catch (error: any) {
    console.error('Error Login:', error);
    res.status(500).json({ success: false, message: 'Error server.' });
  }
};