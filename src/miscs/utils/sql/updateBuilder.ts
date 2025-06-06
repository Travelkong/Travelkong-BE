import QueryBuilder, { type Condition } from "./queryBuilder"

interface IUpdateBuilder<T> {
  where(key: string, operator: string, value: unknown): T
}

export default class UpdateBuilder
  extends QueryBuilder<UpdateBuilder>
  implements IUpdateBuilder<UpdateBuilder>
{
  private readonly _params: unknown[] = []
  private _paramCounter = 1

  where(key: string, operator: string, value: unknown): this {
    this._conditions.push({ key, operator, value })
    return this
  }

  private _setClauses<T>(keys: string[], values: T[], params: T[]): string[] {
    const setClauses: string[] = []
    for (let i = 0; i < keys.length; i++) {
      setClauses.push(`${keys[i]} = $${this._paramCounter}`)
      params.push(values[i])
      this._paramCounter++
    }

    return setClauses
  }

  private _whereClauses(conditions: Condition[], params: unknown[]): string[] {
    const whereClauses: string[] = []
    for (const condition of conditions) {
      whereClauses.push(
        `${condition.key} ${condition.operator} $${this._paramCounter}`,
      )
      params.push(condition.value)
      this._paramCounter++
    }

    return whereClauses
  }

  build(): { query: string; values: unknown[] } {
    let query = `UPDATE ${this._table} SET `
    query += this._setClauses(this._keys, this._values, this._params).join(", ")

    if (this._conditions.length > 0) {
      const whereClauses: string = this._whereClauses(
        this._conditions,
        this._params,
      ).join(" AND ")
      query = `${query} WHERE ${whereClauses}`
    }

    return { query: query, values: this._params }
  }
}
