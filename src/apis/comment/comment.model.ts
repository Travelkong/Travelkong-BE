export interface CommentModel {
    id: string
    post_id: string
    user_id: string
    username: string
    comment: string
    created_at: Date
    updated_at?: Date
}