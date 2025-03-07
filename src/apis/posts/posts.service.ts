import { Logger } from "~/miscs/logger"
import PostsRepository from "./posts.repository"
import { PostContentModel } from "./postContent.model"

export default class PostsService {
  readonly #postsRepository: PostsRepository
  readonly #logger: Logger

  constructor() {
    this.#postsRepository = new PostsRepository()
    this.#logger = new Logger()
  }

  public addPost = async() => {

  }

  public addPostContent = async (payload: PostContentModel) => {

  }
}
