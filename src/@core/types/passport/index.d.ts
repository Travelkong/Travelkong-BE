import "passport"
import type BaseUser from "../BaseUser"

declare module "passport" {
  interface User extends BaseUser {
    username: string
    avatar: string
  }
}
