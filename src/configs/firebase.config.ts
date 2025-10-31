import admin from "firebase-admin"

import { Logger } from "./../miscs/logger"
import EnvConfig from "./env.config"

export default class FirebaseConfig {
  private static _instance: FirebaseConfig | null = null
  private readonly _logger: Logger = new Logger()

  public static async getInstance(): Promise<FirebaseConfig> {
    if (!FirebaseConfig._instance) {
      FirebaseConfig._instance = new FirebaseConfig()
      await FirebaseConfig._instance._connect()
    }

    return FirebaseConfig._instance
  }

  private async _connect(): Promise<void> {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: EnvConfig.firebase.projectId,
          clientEmail: EnvConfig.firebase.clientEmail,
          privateKey: EnvConfig.firebase.privateKey,
        }),
      })
    } catch (error) {
      if (error instanceof Error) {
        this._logger.error(error)
      }
    }
  }
}
