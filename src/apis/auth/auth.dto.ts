export interface RegisterDTO {
  username: string
  email: string
  password: string
}

// Requires only username or password
export type LoginDTO = {
  password: string
} & ({ username: string } | { email: string })

export interface ForgotPasswordDTO {
  email: string
}

export interface ResetPasswordDTO {
  email: string
  password: string
  token: string
}

export interface TokensDTO {
  accessToken: string
  refreshToken: string
  refreshTokenId: string
}
