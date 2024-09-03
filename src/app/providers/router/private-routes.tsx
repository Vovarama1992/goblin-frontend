import type { RouteObject } from 'react-router-dom'

import { WalletPage } from '@/pages/home'
import { ROUTER_PATHS } from '@/shared/config/routes'

import { AuthGuard } from './auth-guard'

const { HOME } = ROUTER_PATHS

export const privateRoutes: RouteObject[] = [
  {
    children: [
      {
        element: <WalletPage />,
        path: HOME,
      },
    ],
    element: <AuthGuard />,
  },
]
