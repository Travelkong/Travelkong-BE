import BaseModel from "~/miscs/others/baseModel"

export interface UserModel extends BaseModel {
  id: string
  username: string
  email: string
  password: string
  profile_picture: string
  address: string
  role: string
}
