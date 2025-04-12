export interface AddPostDTO {
  title: string
  coverImageUrl?: string
  body: string
  images?: string | string[]
  tags?: string[]
}

export interface EditPostDTO {
  id: string
  title: string
  coverImageUrl?: string
  body: string
  images?: string[]
}

export interface EditPostTagsDTO {
  postId: string
  tags: string[]
}