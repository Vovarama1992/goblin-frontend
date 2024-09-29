import { useState } from 'react'

import { useMeQuery } from '@/entities/session'
import {
  useCreateExternalTransactionMutation,
  useCreateInternalTransactionMutation,
  useEstimateTransactionFeeMutation, // Хук для расчета комиссии
  useGetUserWalletsQuery,
} from '@/entities/wallet'

export const TransfersSection = () => {
  const { data: user } = useMeQuery()
  const { data: wallets = [], isLoading } = useGetUserWalletsQuery(user?.id || 0, {
    skip: !user?.id,
  })

  // Отдельные состояния для внутреннего перевода
  const [internalSelectedWalletId, setInternalSelectedWalletId] = useState<null | number>(null)
  const [targetWalletId, setTargetWalletId] = useState<null | number>(null)
  const [internalAmount, setInternalAmount] = useState('')

  // Отдельные состояния для внешнего перевода
  const [externalSelectedWalletId, setExternalSelectedWalletId] = useState<null | number>(null)
  const [externalAmount, setExternalAmount] = useState('')
  const [address, setAddress] = useState('')

  // Состояния для хранения рассчитанных комиссий
  const [internalFee, setInternalFee] = useState<null | number>(null)
  const [externalFee, setExternalFee] = useState<null | number>(null)

  // Новые состояния для хранения ссылки на отслеживание транзакции
  const [internalTrackingUrl, setInternalTrackingUrl] = useState<null | string>(null)
  const [externalTrackingUrl, setExternalTrackingUrl] = useState<null | string>(null)

  // Хуки для выполнения переводов
  const [internalTransfer] = useCreateInternalTransactionMutation()
  const [externalTransfer] = useCreateExternalTransactionMutation()

  // Хук для расчета комиссии
  const [estimateTransactionFee] = useEstimateTransactionFeeMutation()

  // Получение адреса целевого кошелька
  const getTargetWalletAddress = (walletId: number) => {
    const wallet = wallets.find(wallet => wallet.id === walletId)

    return wallet ? wallet.address : ''
  }

  // Обработчик для расчета комиссии для внутреннего перевода
  const handleEstimateInternalFee = async () => {
    if (internalSelectedWalletId && targetWalletId) {
      const recipientAddress = getTargetWalletAddress(targetWalletId) // Получаем адрес получателя

      if (recipientAddress) {
        const response = await estimateTransactionFee({
          amount: parseFloat(internalAmount),
          fromWalletId: internalSelectedWalletId,
          recipientAddress, // Адрес получателя
        }).unwrap()

        setInternalFee(response.feeInTrx)
      }
    }
  }

  // Обработчик для расчета комиссии для внешнего перевода
  const handleEstimateExternalFee = async () => {
    if (externalSelectedWalletId && address) {
      const response = await estimateTransactionFee({
        amount: parseFloat(externalAmount),
        fromWalletId: externalSelectedWalletId,
        recipientAddress: address, // Внешний адрес
      }).unwrap()

      setExternalFee(response.feeInTrx)
    }
  }

  // Обработчик для выполнения внутреннего перевода
  const handleInternalTransfer = async () => {
    if (internalSelectedWalletId && targetWalletId) {
      const response = await internalTransfer({
        amount: parseFloat(internalAmount),
        fromWalletId: internalSelectedWalletId,
        toWalletId: targetWalletId, // Передаем ID кошелька как было изначально
      }).unwrap()

      // Извлечение trackingUrl из ответа и установка его в состояние
      if (response.trackingUrl) {
        setInternalTrackingUrl(response.trackingUrl)
      }
    }
  }

  // Обработчик для выполнения внешнего перевода
  const handleExternalTransfer = async () => {
    if (externalSelectedWalletId) {
      const response = await externalTransfer({
        amount: parseFloat(externalAmount),
        externalAddress: address,
        fromWalletId: externalSelectedWalletId,
      }).unwrap()

      // Извлечение trackingUrl из ответа и установка его в состояние
      if (response.trackingUrl) {
        setExternalTrackingUrl(response.trackingUrl)
      }
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
          onChange={e => setInternalSelectedWalletId(parseInt(e.target.value, 10))}
          value={internalSelectedWalletId || ''}
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
            .filter(wallet => wallet.id !== internalSelectedWalletId)
            .map(wallet => (
              <option key={wallet.id} value={wallet.id}>
                Кошелек №{wallet.id} (USDT: {wallet.usdtBalance || '0.00'}, TRX: {wallet.trxBalance}
                )
              </option>
            ))}
        </select>
        <input
          className={'border p-2 w-full mb-2'}
          onChange={e => setInternalAmount(e.target.value)}
          placeholder={'Введите сумму'}
          type={'text'}
          value={internalAmount}
        />
        <button
          className={'bg-blue-500 text-white px-4 py-2 rounded'}
          onClick={handleEstimateInternalFee}
        >
          Рассчитать комиссию
        </button>
        {internalFee !== null && (
          <p className={'mt-2 text-sm'}>
            <strong>Рассчитанная комиссия:</strong> {internalFee} TRX
          </p>
        )}
        <button
          className={'bg-green-500 text-white px-4 py-2 rounded'}
          onClick={handleInternalTransfer}
        >
          Перевести
        </button>
        {internalTrackingUrl && (
          <p className={'mt-2 text-sm'}>
            <strong>Отслеживание транзакции:</strong>{' '}
            <a
              className={'text-blue-500'}
              href={internalTrackingUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              Посмотреть на TronScan
            </a>
          </p>
        )}
      </div>

      {/* Внешний перевод */}
      <div>
        <h3 className={'text-lg font-medium mb-2'}>Перевод на внешний адрес</h3>
        <select
          className={'border p-2 w-full mb-2'}
          onChange={e => setExternalSelectedWalletId(parseInt(e.target.value, 10))}
          value={externalSelectedWalletId || ''}
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
          onChange={e => setExternalAmount(e.target.value)}
          placeholder={'Введите сумму'}
          type={'text'}
          value={externalAmount}
        />
        <input
          className={'border p-2 w-full mb-2'}
          onChange={e => setAddress(e.target.value)}
          placeholder={'Введите адрес'}
          type={'text'}
          value={address}
        />
        <button
          className={'bg-blue-500 text-white px-4 py-2 rounded'}
          onClick={handleEstimateExternalFee}
        >
          Рассчитать комиссию
        </button>
        {externalFee !== null && (
          <p className={'mt-2 text-sm'}>
            <strong>Рассчитанная комиссия:</strong> {externalFee} TRX
          </p>
        )}
        <button
          className={'bg-red-500 text-white px-4 py-2 rounded'}
          onClick={handleExternalTransfer}
        >
          Перевести
        </button>
        {externalTrackingUrl && (
          <p className={'mt-2 text-sm'}>
            <strong>Отслеживание транзакции:</strong>{' '}
            <a
              className={'text-blue-500'}
              href={externalTrackingUrl}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              Посмотреть на TronScan
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
