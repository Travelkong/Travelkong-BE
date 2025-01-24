import dotenv from "dotenv"
import { Pool, type PoolClient, type QueryResultRow } from "pg"
import { Logger } from "~/miscs/logger"
dotenv.config()

class PostgreSQLConnection {
  private static _instance: PostgreSQLConnection
  private readonly _pool: Pool
  private readonly _logger: Logger

  private constructor() {
    this._logger = new Logger()
    const connectionString: string | undefined = process.env.POSTGRESQL_URL

    if (!connectionString) {
      throw new Error("POSTGRESQL_URL is not set in the environment variable")
    }

    this._pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 2000,
    })

    this._pool.on("error", (err) => {
      this._logger.error(err)
      console.error("Database connection error: ", err)
      process.exit(-1)
    })
  }

  public static getInstace(): PostgreSQLConnection {
    return this._instance || (this._instance = new this())
  }

  public async query<T extends QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<T[]> {
    const client: PoolClient = await this._pool.connect()
    try {
      const result = await client.query<T>(text, params)
      return result.rows
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }

      console.error("Error executing query: ", error)
      throw error
    } finally {
      client.release()
    }
  }
}

export default PostgreSQLConnection.getInstace()
