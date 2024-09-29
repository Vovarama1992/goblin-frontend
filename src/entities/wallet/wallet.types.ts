export type CreateWalletDto = {
  blockchain: string // Тип блокчейна, например, 'TRON'
  userId: number // Идентификатор пользователя, для которого создается кошелек
}

export type WalletDto = {
  address: string // Адрес кошелька в блокчейне
  blockchain: string // Блокчейн, например, 'TRON'
  createdAt: string // Дата создания кошелька
  id: number // Уникальный идентификатор кошелька
  trxBalance: string // Баланс в TRX
  updatedAt: string // Дата последнего обновления
  usdtBalance: string // Баланс в USDT
  userId: number // ID пользователя, которому принадлежит кошелек
}

export type CreateInternalTransactionDto = {
  amount: number // Сумма перевода

  fromWalletId: number // ID кошелька-отправителя
  toWalletId: number // ID кошелька-получателя
  // Тип транзакции
}

export type CreateExternalTransactionDto = {
  amount: number // Сумма перевода

  externalAddress: string // Внешний адрес получателя
  fromWalletId: number // ID кошелька-отправителя
}

export type TransactionDto = {
  amount: number // сумма
  fromAddress: string // адрес отправителя
  hash: string
  id: string // или другой уникальный идентификатор транзакции
  result: 'FAILURE' | 'SUCCESS' // результат транзакции
  timestamp: string // временная метка транзакции
  toAddress: string // адрес получателя
  tokenInfo: any // название токена
}

export type EstimateFeeDto = {
  amount: number // Сумма перевода
  fromWalletId: number // ID кошелька-отправителя
  recipientAddress: string // Адрес получателя (внешний или внутренний)
}

// DTO для ответа с расчетной комиссией
export type FeeDto = {
  feeInTrx: number // Комиссия в TRX
}
