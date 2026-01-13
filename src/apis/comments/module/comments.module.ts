import { Router } from "express"
import { JwtMiddleware } from "~/middlewares"
import type { ServiceContext } from "~/routes"
import {
  AddCommentHandler,
  AddReportHandler,
  CheckUserHandler,
  DeleteCommentHandler,
  EditCommentHandler,
  ResolveReportHandler,
} from "../application/commands/handlers"
import {
  FindAllHandler,
  FindAllReportsHandler,
  FindByPostHandler,
  FindByUserHandler,
  FindOneHandler,
} from "../application/queries/handlers"
import { CommentsRepository } from "../infrastructure"
import CommentsValidator from "../validator"
import {
  AddCommentController,
  AddReportController,
  DeleteCommentController,
  EditCommentController,
  FindAllController,
  FindAllReportsController,
  FindByPostController,
  FindByUserController,
  FindOneController,
  ResolveReportController,
} from "./../presentation/controllers"

export default function CommentsModule(serviceContext: ServiceContext) {
  const commentsRepository = new CommentsRepository(
    serviceContext.loggerService,
  )

  const addCommentHandler = new AddCommentHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const addReportHandler = new AddReportHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const checkUserHandler = new CheckUserHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const deleteCommentHandler = new DeleteCommentHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const resolveReportHandler = new ResolveReportHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const editCommentHandler = new EditCommentHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const findAllReportsHandler = new FindAllReportsHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const findAllHandler = new FindAllHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const findByPostHandler = new FindByPostHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const findByUserHandler = new FindByUserHandler(
    serviceContext.loggerService,
    commentsRepository,
  )
  const findOneHandler = new FindOneHandler(
    serviceContext.loggerService,
    commentsRepository,
  )

  const commentsValidator = new CommentsValidator()
  const addCommentController = new AddCommentController(
    commentsValidator,
    addCommentHandler,
  )
  const addReportController = new AddReportController(
    commentsValidator,
    addReportHandler,
  )
  const deleteCommentController = new DeleteCommentController(
    commentsValidator,
    deleteCommentHandler,
  )
  const resolveReportController = new ResolveReportController(
    commentsValidator,
    resolveReportHandler,
  )
  const editCommentController = new EditCommentController(
    commentsValidator,
    checkUserHandler,
    editCommentHandler,
  )
  const findAllReportsController = new FindAllReportsController(
    commentsValidator,
    findAllReportsHandler,
  )
  const findAllController = new FindAllController(findAllHandler)
  const findByPostController = new FindByPostController(
    commentsValidator,
    findByPostHandler,
  )
  const findByUserController = new FindByUserController(
    commentsValidator,
    findByUserHandler,
  )
  const findOneController = new FindOneController(
    commentsValidator,
    findOneHandler,
  )

  const rootRouter = Router()
  const relatedRouter = Router()

  rootRouter.get("/:id", findOneController.handle)
  rootRouter.get("/", findAllController.handle)
  rootRouter.get(
    "/report",
    JwtMiddleware.isAdmin,
    findAllReportsController.handle,
  )
  rootRouter.post("/", addCommentController.handle)
  rootRouter.post(
    "/report",
    JwtMiddleware.verifyAccessToken,
    addReportController.handle,
  )
  rootRouter.put(
    "/:id",
    JwtMiddleware.verifyAccessToken,
    editCommentController.handle,
  )
  rootRouter.delete(
    "/:id",
    JwtMiddleware.verifyAccessToken,
    deleteCommentController.handle,
  )
  rootRouter.post(
    "/report/:id",
    JwtMiddleware.verifyAccessToken,
    JwtMiddleware.isAdmin,
    resolveReportController.handle,
  )

  relatedRouter.get("/posts/:postId/comments", findByPostController.handle)
  relatedRouter.get("/users/:userId/comments", findByUserController.handle)

  return { rootRouter, relatedRouter }
}
