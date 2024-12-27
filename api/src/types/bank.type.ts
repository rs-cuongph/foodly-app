export type CheckoutRequestType = {
  orderCode: number; // Mã đơn hàng
  amount: number; // Số tiền của đơn hàng
  description: string; // Mô tả đơn hàng, được sử dụng làm nội dung chuyển khoản
  cancelUrl: string; // URL của trang web hoặc ứng dụng sẽ được chuyển hướng tới khi khách hàng hủy thanh toán
  returnUrl: string; // URL của trang web hoặc ứng dụng sẽ được chuyển hướng tới khi khách hàng thanh toán thành công
  signature?: string; // Chữ ký cho dữ liệu của đơn hàng, có chức năng kiểm tra tính toàn vẹn của dữ liệu
  items?: { name: string; quantity: number; price: number }[];
  buyerName?: string; // Tên người mua hàng
  buyerEmail?: string; // Email người mua hàng
  buyerPhone?: string; // Số điện thoại người mua hàng
  buyerAddress?: string; // Địa chỉ người mua hàng
  expiredAt?: number; // Thời gian hết hạn của link thanh toán
};

export type CheckoutResponseDataType = {
  code: string;
  desc: string;
  data: {
    bin: string; // Mã BIN ngân hàng
    accountNumber: string; // Số tài khoản của kênh thanh toán
    accountName: string; // Tên chủ tài khoản của kênh thanh toán
    amount: number; // Số tiền của đơn hàng
    description: string; // Mô tả đơn hàng, được sử dụng làm nội dung chuyển khoản
    orderCode: number; // Mã đơn hàng
    currency: string; // Đơn vị tiền tệ
    paymentLinkId: string; // ID link thanh toán
    status: string; // Trạng thái của link thanh toán
    checkoutUrl: string; // Đường dẫn trang thanh toán
    qrCode: string; // Mã QR thanh toán
  };
  signature: string;
};

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
