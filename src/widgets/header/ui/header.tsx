import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

import { SignOutButton } from '@/features/auth/sign-out'
import { ModeToggle } from '@/features/change-theme'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { cn } from '@/shared/lib/tailwind'
import { Clock } from 'lucide-react'

type User = {
  email: string
}

type HeaderProps = {
  user?: User
} & Omit<ComponentPropsWithoutRef<'header'>, 'children'>

export const Header = ({ className, user, ...rest }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [usdRate, setUsdRate] = useState<null | number>(null)
  const [notificationsCount, setNotificationsCount] = useState<number>(0)
  const [showNotificationEffect, setShowNotificationEffect] = useState<boolean>(false)

  console.log('user: ' + !!user)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    const fetchUsdRate = async () => {
      try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        const data = await response.json()

        setUsdRate(data.Valute.USD.Value)
      } catch (error) {
        console.error('Error fetching USD rate:', error)
      }
    }

    fetchUsdRate()

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const checkNotifications = () => {
      console.log('check')
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      const count = notifications.length

      if (count !== notificationsCount) {
        setNotificationsCount(count)
        setShowNotificationEffect(true)
        setTimeout(() => setShowNotificationEffect(false), 500) // Remove effect after 500ms
      }
    }

    checkNotifications()

    // Optional: set up a listener if notifications could be added from other sources
    const intervalId = setInterval(checkNotifications, 5000) // Check every 5 seconds

    return () => clearInterval(intervalId)
  })

  const formattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`

  return (
    <header
      className={cn(
        'fixed top-0 z-50 bg-background h-[var(--header-height)] w-full lg:text-[16px] text-[12px] border-b border-border/40',
        className
      )}
      {...rest}
    >
      <div className={'px-8 flex h-[var(--header-height)] items-center'}>
        <Link className={'flex gap-2 items-center w-full h-full'} to={ROUTER_PATHS.HOME}>
          <img alt={'Logo'} src={'/logo.png'} style={{ height: '60px', width: '60px' }} />
          <h1 className={'text-lg font-bold'}>{import.meta.env.VITE_APP_NAME}</h1>
        </Link>

        <div className={'flex md:ml-[-120px] items-center w-full justify-center '}>
          <Clock className={'w-6 h-6 text-gray-600'} />
          <span className={'ml-[10px] lg:mr-[160px] mr-[70px]'}> {formattedTime}</span>
          <span className={'inline-block flex flex-row'}>
            $ {usdRate ? `${usdRate.toFixed(2)} руб` : 'Загрузка...'}
          </span>
        </div>

        <div className={'flex flex-1 gap-2 md:justify-end items-center'}>
          {user && <span className={'mr-2'}>{user.email}</span>}
          <ModeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}
