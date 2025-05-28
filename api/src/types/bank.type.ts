export type GateType =
  | 'VCBBANK'
  | 'MBBANK'
  | 'ACBBANK'
  | 'TPBANK'
  | 'TRON_USDT_BLOCKCHAIN'
  | 'BEP20_USDT_BLOCKCHAIN';

export type WebhookResponseDataType = {
  token: string;
  payment: {
    transaction_id: string;
    amount: number;
    content: string;
    date: string;
    account_receiver: string;
    gate: GateType;
  };
};
