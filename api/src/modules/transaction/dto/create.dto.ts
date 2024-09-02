export type CreateTransactionDTO = {
  amount: number;
  orderIds: (string | number)[];
  callbackURL: string;
};
