import { TransactionService } from '../services/TransactionService';
import { TransactionRepository } from '../repositories/TransactionRepository';

jest.mock('../repositories/TransactionRepository');
jest.mock('../utils/cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  invalidateCachePrefix: jest.fn()
}));

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a transaction successfully', async () => {
      const mockData = {
        title: 'Salary',
        type: 'income' as const,
        amount: 5000,
        date: new Date(),
        userId: 'user123' as any
      };
      const mockResult = { _id: 'tx1', ...mockData };
      
      (TransactionRepository.prototype.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.create(mockData);

      expect(TransactionRepository.prototype.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getBalance', () => {
    it('should return balance from repository if not cached', async () => {
      (TransactionRepository.prototype.calculateBalance as jest.Mock).mockResolvedValue(1500);
      
      const result = await service.getBalance('user123');

      expect(TransactionRepository.prototype.calculateBalance).toHaveBeenCalledWith('user123');
      expect(result).toEqual({ balance: 1500 });
    });
  });
});
