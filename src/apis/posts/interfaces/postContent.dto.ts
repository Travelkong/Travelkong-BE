export interface AddPostDTO {
  title: string
  coverImageUrl?: string
  body: string
  images?: string | string[]
  tags?: string[]
}

export interface EditPostDTO extends AddPostDTO {
  id: string
}