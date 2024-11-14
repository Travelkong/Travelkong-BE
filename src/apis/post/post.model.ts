export interface PostModel {
    id: string
    userid: string
    name: string
    images?: string
    liked: boolean
    likes_count: number
    comments_count: number
    views_count: number
}