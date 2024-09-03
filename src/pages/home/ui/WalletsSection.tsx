import { useState } from 'react'

import { useMeQuery } from '@/entities/session'
import { useCreateWalletMutation, useGetUserWalletsQuery } from '@/entities/wallet'
import { WalletDto } from '@/entities/wallet/wallet.types'

import { WalletModal } from './WalletModal'

export const WalletsSection = () => {
  const { data: user } = useMeQuery()
  const { data: wallets = [], isLoading } = useGetUserWalletsQuery(user?.id || 0, {
    skip: !user?.id,
  })
  const [createWallet] = useCreateWalletMutation()
  const [selectedWallet, setSelectedWallet] = useState<WalletDto | null>(null)

  const handleWalletSelect = (wallet: WalletDto) => {
    setSelectedWallet(wallet)
  }

  const handleCreateWallet = () => {
    createWallet({
      blockchain: 'TRON',
      userId: user?.id || 0,
    })
      .unwrap()
      .then(() => {
        window.location.reload() // Перезагрузка страницы после успешного создания кошелька
      })
      .catch(error => {
        console.error('Ошибка при создании кошелька:', error)
      })
  }

  if (isLoading) {
    return <p>Загрузка...</p>
  }

  return (
    <div>
      <h2 className={'text-xl font-semibold mb-4'}>Ваши кошельки</h2>
      <ul className={'space-y-2'}>
        {wallets.map(wallet => (
          <li
            className={'cursor-pointer p-2 rounded bg-white'}
            key={wallet.id}
            onClick={() => handleWalletSelect(wallet)}
          >
            <p>
              <strong>Кошелек №{wallet.id}</strong>
            </p>
            <p>USDT: {wallet.usdtBalance || '0.00'}</p>
            <p>TRX: {wallet.trxBalance}</p>
          </li>
        ))}
      </ul>
      <button
        className={'bg-blue-500 text-white mt-4 px-4 py-2 rounded'}
        onClick={handleCreateWallet}
      >
        Создать новый кошелек
      </button>

      {selectedWallet && (
        <WalletModal onClose={() => setSelectedWallet(null)} wallet={selectedWallet} />
      )}
    </div>
  )
}
