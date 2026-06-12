import { Transaction, ITransaction } from '../models/Transaction';
import { Types } from 'mongoose';

export class TransactionRepository {
  async create(data: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = new Transaction(data);
    return transaction.save();
  }

  async findById(id: string, userId: string): Promise<ITransaction | null> {
    return Transaction.findOne({ _id: id, userId });
  }

  async update(id: string, userId: string, data: Partial<ITransaction>): Promise<ITransaction | null> {
    return Transaction.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }

  async delete(id: string, userId: string): Promise<ITransaction | null> {
    return Transaction.findOneAndDelete({ _id: id, userId });
  }

  async findAll(
    userId: string,
    skip: number,
    limit: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ data: ITransaction[]; total: number }> {
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const [data, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(query)
    ]);

    return { data, total };
  }

  async calculateBalance(userId: string): Promise<number> {
    const result = await Transaction.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', { $multiply: ['$amount', -1] }]
            }
          }
        }
      }
    ]);

    return result.length > 0 ? result[0].total : 0;
  }
}
