import TagsService from "./tags.service"
import TagsValidator from "./tags.validator"

class TagsController {
    readonly #tagsService: TagsService
    readonly #tagsValidator: TagsValidator

    constructor() {
        this.#tagsService = new TagsService()
        this.#tagsValidator = new TagsValidator()
    }

    public findAll = async () => {

    }
}