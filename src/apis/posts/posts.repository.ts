import { Logger } from "~/miscs/logger";

export default class PostsRepository {
    readonly #logger: Logger

    constructor() {
        this.#logger = new Logger()
    }

    
}