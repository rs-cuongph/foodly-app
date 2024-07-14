export type CreateTransactionDto = {
  amount: number;
  orderIds: (string | number)[];
  callbackURL: string;
};
