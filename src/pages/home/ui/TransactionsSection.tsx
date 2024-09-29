import { useMeQuery } from '@/entities/session'
import { useGetUserTransactionsQuery, useGetUserWalletsQuery } from '@/entities/wallet'
import { TransactionDto } from '@/entities/wallet/wallet.types'

const convertToStandardUnit = (amount: number, tokenName: string): number => {
  // Учитываем, что USDT и TRX могут иметь разные минимальные единицы
  if (tokenName === 'hash.ist') {
    return amount / 10000 // Для USDT делим на 10,000
  }
  if (tokenName === 'trx') {
    return amount / 1e6 // Для TRX обычно 1 TRX = 1e6 минимальных единиц
  }

  return amount // Если токен неизвестен, возвращаем как есть
}

const getTokenDisplayName = (tokenName: string): string => {
  if (tokenName === 'hash.ist') {
    return 'USDT' // Отображаем название для USDT
  }
  if (tokenName === 'trx') {
    return 'TRX' // Отображаем название для TRX
  }

  return tokenName // Если токен неизвестен, возвращаем как есть
}

export const TransactionsSection = () => {
  const { data: user } = useMeQuery()
  const { data: transactions = [], isLoading: transactionsLoading } = useGetUserTransactionsQuery(
    user?.id || 0,
    {
      skip: !user?.id,
    }
  )
  const { data: wallets = [], isLoading: walletsLoading } = useGetUserWalletsQuery(user?.id || 0, {
    skip: !user?.id,
  })

  if (transactionsLoading || walletsLoading) {
    return <p>Загрузка...</p>
  }

  return (
    <div>
      <h2 className={'text-xl font-semibold mb-4'}>История транзакций</h2>
      <ul className={'space-y-2'}>
        {transactions
          .filter((transaction: TransactionDto) => {
            const amountInStandardUnit = convertToStandardUnit(
              transaction.amount,
              transaction.tokenInfo.tokenName
            )

            return amountInStandardUnit > 0.01
          })
          .map((transaction: TransactionDto) => {
            const fromUserWallet = wallets.some(
              wallet => wallet.address === transaction.fromAddress
            )
            const toUserWallet = wallets.some(wallet => wallet.address === transaction.toAddress)

            let transactionType: string

            if (transaction.tokenInfo.tokenName == 'hash.ist') {
              transactionType = 'Внутренняя'
            } else if (fromUserWallet) {
              transactionType = 'Исходящая'
            } else if (toUserWallet) {
              transactionType = 'Входящая'
            } else {
              transactionType = 'Внешняя'
            }

            const amountInStandardUnit = convertToStandardUnit(
              transaction.amount,
              transaction.tokenInfo.tokenName
            )
            const tokenDisplayName = getTokenDisplayName(transaction.tokenInfo.tokenName)
            const date = new Date(transaction.timestamp).toLocaleString()
            const status = transaction.result === 'SUCCESS' ? 'Успешно' : 'Неудачно'

            return (
              <li className={'p-2 border rounded'} key={transaction.id}>
                <p>
                  <strong>Адрес:</strong> {transaction.toAddress}
                </p>
                <p>
                  <strong>Тип транзакции:</strong> {transactionType}
                </p>
                <p>
                  <strong>Сумма:</strong> {amountInStandardUnit} {tokenDisplayName}
                </p>
                <p>
                  <strong>Дата:</strong> {date}
                </p>
                <p>
                  <strong>Статус:</strong> {status}
                </p>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
