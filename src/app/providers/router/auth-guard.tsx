import type { AuthContext } from './types'

import { Navigate, Outlet, useOutletContext } from 'react-router-dom'

import { ROUTER_PATHS } from '@/shared/config/routes'

export const AuthGuard = () => {
  const { isAuthenticated } = useOutletContext<AuthContext>()

  return isAuthenticated ? (
    <Outlet context={{ isAuthenticated }} />
  ) : (
    <Navigate replace to={ROUTER_PATHS.SIGN_IN} />
  )
}
