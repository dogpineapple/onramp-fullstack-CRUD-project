/** File for defining interfaces */

export interface Comment {
  id: number,
  body: string,
  author_id: number,
  author_name: string,
  created_at: string,
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
  created_at: string,
  last_updated_at: string,
  bookmark_count: string,
  is_premium: boolean
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
  email: string,
  join_date: string,
  display_name: string
  membership_status: string,
  membership_start_date: string | null,
  membership_end_date: string | null,
  last_submission_date: string | null,
  customer_id: string | null,
  subscription_id: string | null
}