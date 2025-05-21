const getBankId = (paymentMethod: 'vietcombank' | 'vib' | 'mbbank') => {
  const bankIdMap = {
    vietcombank: '970436',
    vib: '970441',
    mbbank: '970422',
  };

  return bankIdMap[paymentMethod as keyof typeof bankIdMap];
};

const getVietQRCode = (
  paymentMethod: 'vietcombank' | 'vib' | 'mbbank',
  accountNumber: string,
  accountName: string,
  amount: number,
  qrCode: string,
) => {
  const bankId = getBankId(paymentMethod);

  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-foNLh5E.jpg?amount=${amount}&addInfo=${qrCode}&accountName=${accountName}`;
};

export { getBankId, getVietQRCode };
