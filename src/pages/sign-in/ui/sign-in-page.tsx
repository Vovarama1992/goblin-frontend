import { useState } from 'react'

import { SignInForm } from '@/features/auth/sign-in'
import { SignUpForm } from '@/features/auth/sign-up'
import { Typography } from '@/shared/ui/typography'
import { Card, CardContent, CardHeader } from '@/shared/ui-shad-cn/ui/card'

import { WelcomeMessage } from './WelcomeMessage'

interface ButtonProps {
  children: any
  isActive: boolean
  onClick: () => void
}

export const SignInPage = () => {
  const [isSignIn, setIsSignIn] = useState(true) // Состояние для переключения форм

  return (
    <div className={'flex h-screen w-[80%]'}>
      {/* Левая часть */}
      <div className={'flex flex-col w-1/2 bg-gray-100 p-8'}>
        {/* Верхняя часть с текстом и кнопками */}
        <div className={'flex flex-col justify-center items-center mb-8'}>
          <Typography className={'text-center lg:text-4xl text-gray-700 mb-6'} variant={'h1'}>
            Добро пожаловать
          </Typography>
          <WelcomeMessage />
          <div className={'flex space-x-4 mb-6'}>
            <Button isActive={isSignIn} onClick={() => setIsSignIn(true)}>
              Вход
            </Button>
            <Button isActive={!isSignIn} onClick={() => setIsSignIn(false)}>
              Регистрация
            </Button>
          </div>
        </div>

        {/* Нижняя часть с формой */}
        <div className={'flex flex-col items-center'}>
          <Card className={'max-w-[320px] w-full'}>
            <CardHeader>
              <Typography className={'text-center lg:text-2xl text-gray-500'} variant={'h2'}>
                {isSignIn ? 'Вход' : 'Регистрация'}
              </Typography>
            </CardHeader>
            <CardContent>{isSignIn ? <SignInForm /> : <SignUpForm />}</CardContent>
          </Card>
        </div>
      </div>

      {/* Правая часть с изображением */}
      <div
        className={'w-1/2 h-full bg-cover bg-center'}
        style={{ backgroundImage: "url('/goblin.webp')" }}
      />
    </div>
  )
}

const Button = ({ children, isActive, onClick }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-white font-semibold ${
        isActive ? 'bg-blue-600' : 'bg-gray-400'
      } hover:bg-blue-500 transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
