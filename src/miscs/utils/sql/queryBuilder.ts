interface IQueryBuilder<T> {
  from(table: string): T
  set(keys: string, value: unknown): T
}

export type Condition = Record<string, unknown>

export default abstract class QueryBuilder<T extends QueryBuilder<T>>
  implements IQueryBuilder<T>
{
  protected _table = ""
  protected readonly _keys: string[] = []
  protected readonly _values: unknown[] = []
  protected readonly _conditions: Condition[] = []

  from(table: string): T {
    this._table = table
    return this as unknown as T
  }

  set(key: string, value: unknown): T {
    this._keys.push(key)
    this._values.push(value)
    return this as unknown as T
  }

  abstract build(): { query: string; values: unknown[] }
}
