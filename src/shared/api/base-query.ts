import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_URL,
  credentials: 'include',
  prepareHeaders: headers => {
    const token = localStorage.getItem('token')

    console.log('Sending token from base_query:', token) // Логируем отправляемый токен
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})
