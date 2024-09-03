import React, { useState } from 'react'

import { Typography } from '@/shared/ui/typography'

export const WelcomeMessage: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false) // Состояние для отслеживания, развернут ли текст

  const handleToggle = () => {
    setIsExpanded(prev => !prev) // Переключение состояния
  }

  return (
    <div className={'text-center mb-6'}>
      <Typography className={'text-gray-700 mb-4'} variant={'h2'}>
        Добро пожаловать на нашу платформу! Мы рады приветствовать вас в мире безопасных и удобных
        финансовых решений
        {isExpanded ? (
          <>
            . Наши услуги включают биржу P2P и крипто-кошелек, созданные для вашего комфорта и
            надежности. Мы стремимся предоставить вам высококачественный сервис и безопасное
            хранение ваших цифровых активов. Доверьтесь нам, и мы сделаем все возможное для того,
            чтобы ваш опыт был приятным и безопасным.
          </>
        ) : (
          '...'
        )}
      </Typography>
      <span className={'text-blue-500 underline cursor-pointer'} onClick={handleToggle}>
        {isExpanded ? 'Свернуть' : 'Далее'}
      </span>
    </div>
  )
}
