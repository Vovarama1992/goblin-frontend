import { baseApi } from '@/shared/api'

import {
  CreateExternalTransactionDto,
  CreateInternalTransactionDto,
  CreateWalletDto,
  TransactionDto, // DTO для транзакций
  WalletDto,
} from './wallet.types'

const walletApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Эндпойнт для внешней транзакции
    createExternalTransaction: builder.mutation<TransactionDto, CreateExternalTransactionDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/transactions/external-transfer',
      }),
    }),

    // Эндпойнт для внутренней транзакции
    createInternalTransaction: builder.mutation<TransactionDto, CreateInternalTransactionDto>({
      query: body => ({
        body,
        method: 'POST',
        url: '/transactions/internal-transfer',
      }),
    }),

    // Эндпойнт для создания кошелька
    createWallet: builder.mutation<WalletDto, CreateWalletDto>({
      query: body => ({
        body: { blockchain: body.blockchain }, // Только blockchain в теле
        method: 'POST',
        url: `/users/wallet/${body.userId}`, // Передаем userId в URL
      }),
    }),

    // Эндпойнт для получения всех транзакций пользователя
    getUserTransactions: builder.query<TransactionDto[], number>({
      query: userId => ({
        method: 'GET',
        url: `/transactions/user/${userId}`,
      }),
    }),

    // Эндпойнт для получения списка всех кошельков пользователя
    getUserWallets: builder.query<WalletDto[], number>({
      query: userId => ({
        method: 'GET',
        url: `/users/wallets/${userId}`,
      }),
    }),
  }),
})

export const {
  useCreateExternalTransactionMutation,
  useCreateInternalTransactionMutation,
  useCreateWalletMutation,
  useGetUserTransactionsQuery,
  useGetUserWalletsQuery,
} = walletApi
