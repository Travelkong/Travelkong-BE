import { Client } from "@opensearch-project/opensearch"

import EnvConfig from "./env.config"
import type { Logger } from "~/miscs/logger"

export default class OpenSearchConfig {
  static #instance: OpenSearchConfig | null = null
  #client: Client | null = null
  #isConnected = false
  readonly #logger!: Logger

  private constructor() {}

  public static async getInstance(): Promise<OpenSearchConfig> {
    if (!OpenSearchConfig.#instance) {
      OpenSearchConfig.#instance = new OpenSearchConfig()
      await OpenSearchConfig.#instance.#connect()
    }

    return OpenSearchConfig.#instance
  }

  public getClient(): Client {
    if (!this.#client) {
      throw new Error(
        "OpenSearch client must be initialized by calling getInstance() first.",
      )
    }

    return this.#client
  }

  public async closeConnection(): Promise<void> {
    if (this.#client) {
      console.log("Gracefully shutting down.")
      await this.#client.close()
      this.#client = null
      this.#isConnected = false
    }
  }

  async #connect(): Promise<void> {
    if (this.#isConnected) return

    const url = EnvConfig.opensearchUrl
    if (!url) {
      throw new Error("OpenSearch connection string is missing")
    }

    this.#client = new Client({ node: url })
    this.#isConnected = true

    try {
      const health = await this.#client.cluster.health()
      console.log("Cluster status: ", health)
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      console.error("OpenSearch connection error: ", error)
    }
  }
}
