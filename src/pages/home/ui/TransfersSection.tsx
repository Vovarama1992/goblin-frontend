import { useState } from 'react'

import { useMeQuery } from '@/entities/session'
import {
  useCreateExternalTransactionMutation,
  useCreateInternalTransactionMutation,
  useGetUserWalletsQuery,
} from '@/entities/wallet'

export const TransfersSection = () => {
  const { data: user } = useMeQuery()
  const { data: wallets = [], isLoading } = useGetUserWalletsQuery(user?.id || 0, {
    skip: !user?.id,
  })
  const [selectedWalletId, setSelectedWalletId] = useState<null | number>(null)
  const [targetWalletId, setTargetWalletId] = useState<null | number>(null)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')

  const [internalTransfer] = useCreateInternalTransactionMutation()
  const [externalTransfer] = useCreateExternalTransactionMutation()

  const handleInternalTransfer = () => {
    if (selectedWalletId && targetWalletId) {
      internalTransfer({
        amount: parseFloat(amount),
        fromWalletId: selectedWalletId,
        toWalletId: targetWalletId,
      })
    }
  }

  const handleExternalTransfer = () => {
    if (selectedWalletId) {
      externalTransfer({
        amount: parseFloat(amount),
        externalAddress: address,
        fromWalletId: selectedWalletId,
      })
    }
  }

  if (isLoading) {
    return <p>Загрузка...</p>
  }

  return (
    <div>
      <h2 className={'text-xl font-semibold mb-4'}>Переводы</h2>

      {/* Внутренний перевод */}
      <div className={'mb-4'}>
        <h3 className={'text-lg font-medium mb-2'}>Перевод между своими кошельками</h3>
        <select
          className={'border p-2 w-full mb-2'}
          onChange={e => setSelectedWalletId(parseInt(e.target.value, 10))}
          value={selectedWalletId || ''}
        >
          <option disabled value={''}>
            Выберите кошелек для перевода
          </option>
          {wallets.map(wallet => (
            <option key={wallet.id} value={wallet.id}>
              Кошелек №{wallet.id} (USDT: {wallet.usdtBalance || '0.00'}, TRX: {wallet.trxBalance})
            </option>
          ))}
        </select>
        <select
          className={'border p-2 w-full mb-2'}
          onChange={e => setTargetWalletId(parseInt(e.target.value, 10))}
          value={targetWalletId || ''}
        >
          <option disabled value={''}>
            Выберите целевой кошелек
          </option>
          {wallets
            .filter(wallet => wallet.id !== selectedWalletId)
            .map(wallet => (
              <option key={wallet.id} value={wallet.id}>
                Кошелек №{wallet.id} (USDT: {wallet.usdtBalance || '0.00'}, TRX: {wallet.trxBalance}
                )
              </option>
            ))}
        </select>
        <input
          className={'border p-2 w-full mb-2'}
          onChange={e => setAmount(e.target.value)}
          placeholder={'Введите сумму'}
          type={'text'}
          value={amount}
        />
        <button
          className={'bg-green-500 text-white px-4 py-2 rounded'}
          onClick={handleInternalTransfer}
        >
          Перевести
        </button>
      </div>

      {/* Внешний перевод */}
      <div>
        <h3 className={'text-lg font-medium mb-2'}>Перевод на внешний адрес</h3>
        <select
          className={'border p-2 w-full mb-2'}
          onChange={e => setSelectedWalletId(parseInt(e.target.value, 10))}
          value={selectedWalletId || ''}
        >
          <option disabled value={''}>
            Выберите кошелек для перевода
          </option>
          {wallets.map(wallet => (
            <option key={wallet.id} value={wallet.id}>
              Кошелек №{wallet.id} (USDT: {wallet.usdtBalance || '0.00'}, TRX: {wallet.trxBalance})
            </option>
          ))}
        </select>
        <input
          className={'border p-2 w-full mb-2'}
          onChange={e => setAmount(e.target.value)}
          placeholder={'Введите сумму'}
          type={'text'}
          value={amount}
        />
        <input
          className={'border p-2 w-full mb-2'}
          onChange={e => setAddress(e.target.value)}
          placeholder={'Введите адрес'}
          type={'text'}
          value={address}
        />
        <button
          className={'bg-red-500 text-white px-4 py-2 rounded'}
          onClick={handleExternalTransfer}
        >
          Перевести
        </button>
      </div>
    </div>
  )
}
