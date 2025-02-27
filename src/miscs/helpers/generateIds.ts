import { v4 as uuidv4 } from "uuid"
const { nanoid } = require("nanoid") // This is the only way that works for some reason.

export const generateUserId = (): string => {
  return uuidv4()
}

export const generateId = (): string => {
  return nanoid()
}