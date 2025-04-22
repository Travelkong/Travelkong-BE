import QueryBuilder, { type Condition } from "./queryBuilder"

export default class UpdateBuilder extends QueryBuilder<UpdateBuilder> {
  private readonly _params: unknown[] = []
  private _paramCounter = 1

  private _setClauses<T>(key: string[], values: T[], params: T[]): string[] {
    const setClauses = []
    for (let i = 0; i < key.length; i++) {
      setClauses.push(`${key[i]} = $${this._paramCounter}`)
      params.push(values[i])
      this._paramCounter++
    }

    return setClauses
  }

  private _whereClauses(conditions: Condition[], params: unknown[]): string[] {
    const whereClauses = []
    for (const condition of conditions) {
      whereClauses.push(`${condition.key} ${condition.operator} $${this._paramCounter}`)
      params.push(condition.value)
      this._paramCounter++
    }

    return whereClauses
  }

  build(): { query: string; values: unknown[] } {
    let query = `UPDATE ${this._table} SET `
    query += this._setClauses(this._key, this._values, this._params).join(", ")

    if (this._conditions.length > 0) {
      const whereClauses: string = this._whereClauses(this._conditions, this._params).join(" AND ")
      query = `${query} WHERE ${whereClauses}`
    }

    return { query: query, values: this._params }
  }
}
