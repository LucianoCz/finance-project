import mongoose, { Schema, Document, Types } from 'mongoose';

export type TransactionType = 'income' | 'expense';

export interface ITransaction extends Document {
  title: string;
  type: TransactionType;
  amount: number;
  date: Date;
  userId: Types.ObjectId;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
