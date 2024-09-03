import type { AuthContext } from '../providers/router/types'

import { Outlet } from 'react-router-dom'

import { useMeQuery } from '@/entities/session'
import { Header } from '@/widgets/header'

export const RootLayout = () => {
  const { data, isError, isLoading } = useMeQuery()
  const isAuthenticated = !isError && !isLoading

  const contextValue: AuthContext = {
    email: data?.email,
    id: data?.id,
    isAuthenticated,
  }

  const user = data ? data : undefined

  const renderMain = (
    <main
      className={
        'grow flex  flex-col lg:justify-center lg:items-center justify-center items-center pt-[var(--header-height)]'
      }
    >
      <Outlet context={contextValue} />
    </main>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return (
      <>
        <Header user={user} />
        <div className={'h-screen min-w-full flex flex-col'} translate={'no'}>
          {renderMain}
        </div>
      </>
    )
  }

  return (
    <div className={'h-screen min-w-full flex flex-col'}>
      <Header />
      {!isLoading && renderMain}
    </div>
  )
}
