import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

import type Comment from "../domain"
import {
  AddCommentDto,
  AddReportDto,
  EditCommentDTO,
  FindCommentDto,
} from "../presentation/dtos"

export default class CommentsValidator {
  public async add(payload: Comment) {
    const dto = plainToInstance(AddCommentDto, payload, {
      enableImplicitConversion: false,
      excludeExtraneousValues: true,
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    if (errors?.length > 0) {
      return errors
    }

    return null
  }

  public async addReport(payload: AddReportDto) {
    const dto = plainToInstance(AddReportDto, payload, {
      enableImplicitConversion: false,
      excludeExtraneousValues: true,
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    if (errors?.length > 0) {
      return errors
    }

    return null
  }

  public async edit(payload: EditCommentDTO) {
    const dto = plainToInstance(EditCommentDTO, payload, {
      enableImplicitConversion: false,
      excludeExtraneousValues: true,
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    if (errors?.length > 0) {
      return errors
    }

    return null
  }

  public async id(id: string) {
    const dto = plainToInstance(FindCommentDto, id, {
      enableImplicitConversion: false,
      excludeExtraneousValues: true,
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    })

    if (errors?.length > 0) {
      return errors
    }

    return null
  }
}
