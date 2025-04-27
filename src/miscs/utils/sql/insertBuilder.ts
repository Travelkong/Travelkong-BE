import QueryBuilder from "./queryBuilder"

export default class InsertBuilder extends QueryBuilder<InsertBuilder> {
  private readonly _params: unknown[] = []
  private _paramCounter = 1

  // TODO: optimize this so that it wouldn't be O(n^2).
  private _column<T>(keys: string[], values: T[], params: T[]): string[] {
    const valueArr = []
    for (let i = 0; i < keys.length; i++) {
      valueArr.push(`${keys[i]}`)
      params.push(values[i])
      this._paramCounter++
    }

    return valueArr
  }

  private _setPlaceholders(keys: string[]): string[] {
    const placeholders = []
    for (let i = 1; i <= keys.length; i++) {
      placeholders.push(`$${i}`)
    }

    return placeholders
  }

  build(): {query: string; values: unknown[]} {
    let query = `INSERT INTO ${this._table} `
    query += `(${this._column(this._keys, this._values, this._params).join(", ")}) VALUES `
    query += `(${this._setPlaceholders(this._keys).join(", ")})`

    return { query: query, values: this._values }
  }
}
