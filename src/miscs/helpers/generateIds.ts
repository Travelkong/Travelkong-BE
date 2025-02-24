import { v4 as uuidv4 } from "uuid"
import { nanoid } from "nanoid"

export const generateUserId = (): string => {
  return uuidv4()
}

export const generateId = (): string => {
  return nanoid()
}