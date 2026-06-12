import { TransactionRepository } from '../repositories/TransactionRepository';
import { ITransaction } from '../models/Transaction';
import { getCache, setCache, invalidateCachePrefix } from '../utils/cache';

const transactionRepository = new TransactionRepository();

export class TransactionService {
  async create(data: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = await transactionRepository.create(data);
    invalidateCachePrefix(`transactions_${data.userId}`);
    invalidateCachePrefix(`balance_${data.userId}`);
    return transaction;
  }

  async findById(id: string, userId: string): Promise<ITransaction | null> {
    return transactionRepository.findById(id, userId);
  }

  async update(id: string, userId: string, data: Partial<ITransaction>): Promise<ITransaction | null> {
    const transaction = await transactionRepository.update(id, userId, data);
    if (transaction) {
      invalidateCachePrefix(`transactions_${userId}`);
      invalidateCachePrefix(`balance_${userId}`);
    }
    return transaction;
  }

  async delete(id: string, userId: string): Promise<ITransaction | null> {
    const transaction = await transactionRepository.delete(id, userId);
    if (transaction) {
      invalidateCachePrefix(`transactions_${userId}`);
      invalidateCachePrefix(`balance_${userId}`);
    }
    return transaction;
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ) {
    const cacheKey = `transactions_${userId}_${page}_${limit}_${startDate?.toISOString()}_${endDate?.toISOString()}`;
    const cachedData = getCache<any>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const skip = (page - 1) * limit;
    const result = await transactionRepository.findAll(userId, skip, limit, startDate, endDate);
    
    const response = {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };

    setCache(cacheKey, response);
    return response;
  }

  async getBalance(userId: string): Promise<{ balance: number }> {
    const cacheKey = `balance_${userId}`;
    const cachedBalance = getCache<{ balance: number }>(cacheKey);

    if (cachedBalance) {
      return cachedBalance;
    }

    const balance = await transactionRepository.calculateBalance(userId);
    const result = { balance };
    setCache(cacheKey, result);
    return result;
  }
}
