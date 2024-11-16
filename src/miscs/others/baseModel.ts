export default interface BaseModel {
    created_at: Date
    updated_at?: Date
    deleted_at?: Date | null
}