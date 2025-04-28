import QueryBuilder from "./queryBuilder"

export default class InsertBuilder extends QueryBuilder<InsertBuilder> {
  private readonly _params: unknown[] = [] // An array of user-inputted data

  private _columns<T>(
    keys: string[],
    values: T[],
    params: T[],
  ): [string[], string[]] {
    const columns: string[] = []
    const placeholders: string[] = []

    keys.forEach((key, index) => {
      columns.push(`${key}`)
      params.push(values[index])
      placeholders.push(`$${index + 1}`)
    })

    return [columns, placeholders]
  }

  build(): { query: string; values: unknown[] } {
    const [columns, placeholders] = this._columns(
      this._keys,
      this._values,
      this._params,
    )

    // It would look like this: "INSERT INTO table (column1, column2) VALUES ($1, $2)"
    const query = `INSERT INTO ${this._table} (${columns}) VALUES (${placeholders})`

    return { query: query, values: this._values }
  }
}
