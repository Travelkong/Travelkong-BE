import postgresqlConnection from "~/configs/postgresql.config"
import { Logger } from "~/miscs/logger"
import { ROLE } from "~/miscs/others"

const logger = new Logger()

export const isAdmin = async (
  id: string,
): Promise<boolean | undefined> => {
  try {
    const query = "SELECT role FROM users WHERE id = $1"
    const [response] = await postgresqlConnection.query(query, [id])

    if (response.role === ROLE.ADMIN) {
      return true
    }

    return false
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error)
    }

    throw error
  }
}
