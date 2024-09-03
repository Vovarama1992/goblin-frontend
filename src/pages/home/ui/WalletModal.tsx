import { WalletDto } from '@/entities/wallet/wallet.types'

interface WalletModalProps {
  onClose: () => void
  wallet: WalletDto
}

export const WalletModal = ({ onClose, wallet }: WalletModalProps) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    alert('Адрес скопирован в буфер обмена')
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center z-50'}>
      <div className={'bg-white p-6 rounded-lg shadow-lg z-10'}>
        <h3 className={'text-lg font-medium mb-2'}>Кошелек №{wallet.id}</h3>
        <p>
          <strong>Адрес:</strong> {wallet.address}{' '}
          <button className={'text-blue-500 underline'} onClick={handleCopyAddress}>
            Копировать
          </button>
        </p>
        <p>
          <strong>USDT:</strong> {wallet.usdtBalance || '0.00'}
        </p>
        <p>
          <strong>TRX:</strong> {wallet.trxBalance}
        </p>
        <p>
          <strong>Создан:</strong> {new Date(wallet.createdAt).toLocaleString()}
        </p>
        <button className={'mt-4 bg-red-500 text-white px-4 py-2 rounded'} onClick={onClose}>
          Закрыть
        </button>
      </div>
      <div className={'fixed inset-0 bg-black opacity-50'} onClick={onClose}></div>
    </div>
  )
}
