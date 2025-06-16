import "passport"

declare module "passport" {
  interface User {
    userId: string
    email: string
    role: string
  }
}
