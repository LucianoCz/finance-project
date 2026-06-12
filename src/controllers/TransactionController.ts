import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/TransactionService';

const transactionService = new TransactionService();

interface AuthRequest extends Request {
  user?: { id: string };
}

export class TransactionController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, type, amount, date } = req.body;
      const transaction = await transactionService.create({
        title,
        type,
        amount,
        date: new Date(date),
        userId: req.user!.id as any
      });
      res.status(201).json(transaction);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.update(id, req.user!.id, req.body);
      if (!transaction) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }
      res.json(transaction);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.delete(id, req.user!.id);
      if (!transaction) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const data = await transactionService.findAll(req.user!.id, page, limit, startDate, endDate);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getBalance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Recebendo código do usuário da rota e garantindo que quem chama seja o próprio usuário (ou ajustando a regra)
      const userIdFromRoute = req.params.userId;
      if (userIdFromRoute !== req.user!.id) {
        res.status(403).json({ message: 'Forbidden: You can only view your own balance' });
        return;
      }
      const data = await transactionService.getBalance(userIdFromRoute);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}
