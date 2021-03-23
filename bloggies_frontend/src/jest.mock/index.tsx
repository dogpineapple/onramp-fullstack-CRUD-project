import { Comment, Post, User } from "../custom";

export const MOCK_USER: User = {
  id: 1,
  display_name :"test",
  membership_status: "none",
  membership_start_date:"2021-03-22T23:58:37.189Z",
  membership_end_date: null,
  last_submission_date: '',
  email:"test@user.com"
};

export const MOCK_POST: Post = {
  id: 123,
  title: 'test title',
  description: 'test description',
  body: 'test body',
  author_id: 1,
  author_name: 'test user',
  created_at: '1/1/2020',
  last_updated_at: '1/1/2020',
  favorite_count: '5'
};

export const MOCK_POSTS: Array<Post> = [
  {
    id: 1,
    title: 'first post',
    description: 'first test description',
    body: 'first test body',
    author_id: 1,
    author_name: 'test user',
    created_at: '1/1/2020',
    last_updated_at: '1/1/2020',
    favorite_count: '0'
  },
  {
    id: 2,
    title: 'second post',
    description: 'second test description',
    body: 'second test body',
    author_id: 1,
    author_name: 'test user',
    created_at: '1/1/2020',
    last_updated_at: '1/1/2020',
    favorite_count: '1'
  },
  {
    id: 3,
    title: 'third post',
    description: 'third test description',
    body: 'third test body',
    author_id: 1,
    author_name: 'test user',
    created_at: '1/1/2020',
    last_updated_at: '1/1/2020',
    favorite_count: '5'
  }
];

export const MOCK_COMMENT: Comment = {
  id: 1,
  body: "test comment",
  author_id: 1,
  author_name: "test user",
  created_at: "1/1/2021",
  is_reply: false,
  reply_count: "1",
  post_id: 1
}

export const MOCK_COMMENTS: Array<Comment> = [
  {
    id: 1,
    body: "first test comment",
    author_id: 1,
    author_name: "test user",
    created_at: "1/1/2021",
    is_reply: false,
    reply_count: "1",
    post_id: 1
  },
  {
    id: 2,
    body: "second test comment",
    author_id: 1,
    author_name: "test user",
    created_at: "1/1/2021",
    is_reply: false,
    reply_count: "1",
    post_id: 1
  }
];

export const MOCK_STORE = { user: {}, posts: [], favorites: [], searchResults: { posts: [], users: [] }, serverErr: "" };