import { Expose, Transform } from "class-transformer"
import { PAGINATION } from "@configs"

export default class PaginationService {
  private static readonly MAX_LIMIT = PAGINATION.MAX_LIMIT

  @Expose()
  @Transform(({ value }) => Number(value) || 0)
  private _offset: number

  @Expose()
  @Transform(({ value }) => Number(value) || 0)
  private _limit: number

  @Expose()
  @Transform(({ value }) => Number(value) || 0)
  private _total!: number

  @Expose()
  @Transform(({ value }) => Number(value) || 0)
  private _totalPages!: number

  @Expose()
  @Transform(({ value }) => Number(value) || 0)
  private _currentPage: number

  constructor(limit = 10, currentPage = 1) {
    const safeLimit =
      limit <= 0 ? 10 : Math.min(limit, PaginationService.MAX_LIMIT)

    this._limit = safeLimit
    this._offset =
      currentPage && currentPage > 0 ? (currentPage - 1) * this._limit : 0
    this._currentPage = currentPage <= 0 ? 1 : currentPage
  }

  public setTotal(total: number): void {
    this._total = total
    this._totalPages = +Math.ceil(this._total / this._limit)
  }

  public get offset(): number {
    return this._offset
  }

  public get limit(): number {
    return this._limit
  }

  public get total(): number {
    return this._total
  }

  public get totalPages(): number {
    return this._totalPages
  }

  public get currentPage(): number {
    return this._currentPage
  }

  public static get maxLimit(): number {
    return PaginationService.MAX_LIMIT
  }
}
