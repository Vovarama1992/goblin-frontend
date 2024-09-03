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
  amount: number // Сумма перевода
  createdAt: string // Дата создания транзакции

  externalAddress?: string // Внешний адрес получателя (если внешний перевод)
  fromWalletId: number // ID кошелька-отправителя
  id: number // Уникальный идентификатор транзакции
  status: 'COMPLETED' | 'FAILED' | 'PENDING' // Статус транзакции
  toWalletId?: number // ID кошелька-получателя (если внутренний перевод)
  type: 'EXTERNAL_OUTGOING' | 'INTERNAL' // Тип транзакции
  updatedAt: string // Дата последнего обновления
}
