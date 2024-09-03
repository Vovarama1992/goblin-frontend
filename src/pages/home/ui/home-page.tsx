import { useState } from 'react'

import { TransactionsSection } from './TransactionsSection'
import { TransfersSection } from './TransfersSection'
import { WalletsSection } from './WalletsSection'

export const WalletPage = () => {
  const [activeSection, setActiveSection] = useState<'transactions' | 'transfers' | 'wallets'>(
    'wallets'
  )

  return (
    <div className={'flex flex-col h-screen'}>
      <div className={'flex justify-around p-4 bg-gray-200'}>
        <button
          className={`px-4 py-2 ${activeSection === 'wallets' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setActiveSection('wallets')}
        >
          Кошельки
        </button>
        <button
          className={`px-4 py-2 ${activeSection === 'transfers' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setActiveSection('transfers')}
        >
          Переводы
        </button>
        <button
          className={`px-4 py-2 ${activeSection === 'transactions' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setActiveSection('transactions')}
        >
          Транзакции
        </button>
      </div>

      <div className={'p-4 flex-grow'}>
        {activeSection === 'wallets' && <WalletsSection />}
        {activeSection === 'transfers' && <TransfersSection />}
        {activeSection === 'transactions' && <TransactionsSection />}
      </div>
    </div>
  )
}
