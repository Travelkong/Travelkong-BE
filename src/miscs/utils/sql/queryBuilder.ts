interface IQueryBuilder<T> {
    from(table: string): T
    set(key: string, value: unknown): T
    where(key: string, operator: string, value: unknown): T
}

export type Condition = Record<string, unknown>

export default abstract class QueryBuilder<T extends QueryBuilder<T>> implements IQueryBuilder<T> {
    protected _table = ""
    protected readonly _key: string[] = []
    protected readonly _values: unknown[] = []
    protected readonly _conditions: Condition[] = []

    from(table: string): T {
        this._table = table
        return this as unknown as T
    }

    set(key: string, value: unknown): T {
        this._key.push(key)
        this._values.push(value)
        return this as unknown as T
    }

    where(key: string, operator: string, value: unknown): T {
        this._conditions.push({ key, operator, value })
        return this as unknown as T
    }

    abstract build(): { query: string; values: unknown[] }
}