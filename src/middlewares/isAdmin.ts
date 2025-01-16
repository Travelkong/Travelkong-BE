import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import { ROLE } from "~/miscs/others"

const logger = new Logger()

export const isAdmin = async (userId: string): Promise<boolean | undefined> => {
  try {
    const queryString = "SELECT role FROM users WHERE id = $1"
    const response = await postgresqlConnection.query(queryString, [userId])

    console.log(response)
    if (response[0].role === ROLE.ADMIN) {
      return true
    }

    return false
  } catch (error: unknown) {
    if (error instanceof Error) {
        logger.error(error)
    }
  }
}
