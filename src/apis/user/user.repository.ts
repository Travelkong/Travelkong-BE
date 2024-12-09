import postgresqlConnection from '~/configs/postgresql.config';
import { Logger } from "~/miscs/logger"
import { UserModel } from "./user.model"
import { QueryResultRow } from 'pg';

interface IUserRepository {
    current(userId: string): Promise<UserModel>
}

export default class UserRepository implements IUserRepository {
    readonly #logger: Logger

    constructor() {
        this.#logger = new Logger()
    }

    public getCurrentUser = async (userId: string): Promise<UserModel> => {
        try {
            const queryString: string = "SELECT * FROM users WHERE userId = $1 LIMIT 1"
            const response: QueryResultRow[] = await postgresqlConnection.query(queryString, userId)
            return (response as UserModel[])[0]
        } catch (error: any) {
            this.#logger.error(error)
            throw error
        }
    }
}