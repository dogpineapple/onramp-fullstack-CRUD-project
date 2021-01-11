export interface Comment {
  id: number,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  is_reply: Boolean,
  reply_count: string,
  post_id: number
}

export interface Post {
  id: number,
  title: string,
  description: string,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  last_updated_at: Date,
  favorite_count: string
}

export interface PostFormData {
  title: string,
  description: string,
  body: string
}

export interface CustomReduxState {
  user: any,
  posts: Array<Post>,
  favorites: Array<Post>,
  searchResults: SearchResults,
  serverErr: string
}

interface SearchResults {
  posts: Array<Post>,
  users: Array<User>
}

export interface User {
  id: number,
  username: string,
  join_date: Date,
  display_name: string
}