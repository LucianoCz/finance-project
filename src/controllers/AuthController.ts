import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const user = await authService.register(name, email, password);
      res.status(201).json(user);
    } catch (err: any) {
      if (err.message === 'Email already in use') {
        res.status(400).json({ message: err.message });
        return;
      }
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      res.json(data);
    } catch (err: any) {
      if (err.message === 'Invalid credentials') {
        res.status(401).json({ message: err.message });
        return;
      }
      next(err);
    }
  }
}
