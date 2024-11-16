import BaseModel from "~/miscs/others/baseModel"

export interface PostModel extends BaseModel {
    id: string
    userid: string
    name: string
    images?: string
    liked: boolean
    likes_count: number
    comments_count: number
    views_count: number
}