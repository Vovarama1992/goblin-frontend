import { useMeQuery } from '@/entities/session'
import { useGetUserTransactionsQuery, useGetUserWalletsQuery } from '@/entities/wallet'
import { TransactionDto } from '@/entities/wallet/wallet.types'

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
        {transactions.map((transaction: TransactionDto) => {
          const fromUserWallet = wallets.some(wallet => wallet.id === transaction.fromWalletId)
          const toUserWallet = wallets.some(wallet => wallet.id === transaction.toWalletId)

          let transactionType = 'Внешняя'

          if (fromUserWallet && toUserWallet) {
            transactionType = 'Внутренняя'
          } else if (fromUserWallet) {
            transactionType = 'Исходящая'
          } else if (toUserWallet) {
            transactionType = 'Входящая'
          }

          return (
            <li className={'p-2 border rounded'} key={transaction.id}>
              <p>
                <strong>Тип:</strong> {transactionType}
              </p>
              <p>
                <strong>Сумма:</strong> {transaction.amount} USDT
              </p>
              <p>
                <strong>Статус:</strong> {transaction.status}
              </p>
              <p>
                <strong>Дата:</strong> {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
