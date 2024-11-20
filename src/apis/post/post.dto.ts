export interface CreatePostDTO {
  user_id: string
  post_content: {
    id: number
    title: string
    cover_image_url: string
    body: string
    images?: string
    tags?: string[]
  }
}

export interface EditPostDTO {
  id: string
  post_content: {
    id: number
    title?: string
    cover_image_url?: string
    body?: string
    images?: string
    tags?: string[]
  }
}

export interface DeletePostDTO {
  id: string
}
