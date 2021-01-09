export interface Comment {
  id: number,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  is_reply: Boolean,
  reply_count: number
}

export interface Post {
  id: number,
  title: string,
  description: string,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  last_updated_at: Date
}