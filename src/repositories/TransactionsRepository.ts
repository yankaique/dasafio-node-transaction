/* eslint-disable no-param-reassign */
import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((total, element): number => {
      // eslint-disable-next-line no-return-assign
      if (element.type === 'income') return (total += element.value);
      return total;
    }, 0);

    const outcome = this.transactions.reduce((total, element) => {
      // eslint-disable-next-line no-return-assign
      if (element.type === 'outcome') return (total += element.value);
      return total;
    }, 0);

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const dataTransaction = new Transaction({ title, value, type });
    const balance = this.getBalance();

    if (dataTransaction.type === 'outcome' && dataTransaction.value > balance.total) {
      throw Error("Your output value must be less than the total");
    }

    this.transactions.push(dataTransaction);

    return dataTransaction;
  }
}

export default TransactionsRepository;
