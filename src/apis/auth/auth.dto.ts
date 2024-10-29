export interface RegisterDTO {
  username: string
  email: string
  password: string
}

// Requires only username or password
export type LoginDTO = {
  password: string
} & ({ username: string } | { email: string })
