import type BaseUser from "../BaseUser"

declare global {
  namespace Express {
    interface User extends BaseUser {
      role: string
    }

    interface Request {
      user?: User
    }
  }
}
