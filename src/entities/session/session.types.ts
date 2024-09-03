export type BaseUserDto = {
  email: string
  id: number
}

export type UserRegisteredDto = {
  token: string
} & BaseUserDto

export type UserAuthenticatedDto = {
  id: number
} & RegistrationDto

export type RegistrationDto = {
  email: string

  password: string
}

export type LoginDto = {
  email: string
  password: string
}

export type Permissions = {
  common_sales: boolean
  contragents: boolean
  departures: boolean
  finances: boolean
  my_sales: boolean
  procurements: boolean
  salary_reports: boolean
  summary_table: boolean
  suppliers: boolean
}
