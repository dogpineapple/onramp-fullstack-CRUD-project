export const MOCK_USER = {
  id: 1,
  username: "testusername",
  join_date: "jan 1, 2020",
  display_name: "Test Username"
};

export const MOCK_POST = {
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

export const MOCK_STORE = { user: {}, posts: [], favorites: [], searchResults: { posts: [], users: [] }, serverErr: "" };