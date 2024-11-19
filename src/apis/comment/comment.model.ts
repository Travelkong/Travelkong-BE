export interface CommentModel {
    id: number
    parent_comment_id?: number
    post_id: number
    user_id: string
    username: string
    user_profile_picture: string
    comment: string
    images?: string
    created_at: Date
    updated_at?: Date
}