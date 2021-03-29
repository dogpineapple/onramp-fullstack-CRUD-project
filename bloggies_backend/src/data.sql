DROP DATABASE IF EXISTS "learning_circle_test";
DROP DATABASE IF EXISTS "learning_circle";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "posts";
DROP TABLE IF EXISTS "comments";
DROP TABLE IF EXISTS "replies";
DROP TABLE IF EXISTS "bookmarks";

CREATE DATABASE "learning_circle_test";
CREATE DATABASE "learning_circle";

\c "learning_circle"

CREATE TABLE user_auth (
  id SERIAL PRIMARY KEY,
  email VARCHAR (25) UNIQUE NOT NULL,
  hashed_pwd VARCHAR (100) NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE users (
  user_id INT NOT NULL PRIMARY KEY REFERENCES user_auth ON DELETE CASCADE,
  display_name VARCHAR (30) UNIQUE NOT NULL,
  membership_status VARCHAR (50) NOT NULL DEFAULT 'none',
  membership_start_date TIMESTAMP WITH TIME ZONE,
  membership_end_date TIMESTAMP WITH TIME ZONE,
  last_submission_date TIMESTAMP WITH TIME ZONE,
  customer_id TEXT,
  subscription_id TEXT,
  cancel_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255) NOT NULL,
  description VARCHAR (255),
  body VARCHAR (10000),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  author_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookmarks (
  post_id INT NOT NULL REFERENCES posts ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body VARCHAR(5000) NOT NULL,
  post_id INT NOT NULL REFERENCES posts ON DELETE CASCADE,
  author_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_reply BOOLEAN NOT NULL
);

CREATE TABLE replies (
  comment_id INT NOT NULL REFERENCES comments ON DELETE CASCADE,
  reply_to_comment_id INT NOT NULL REFERENCES comments ON DELETE CASCADE
);


INSERT INTO user_auth(email, hashed_pwd)
VALUES
    ('learningcircle@test.com', 'password'),
    ('test@test.com', 'password'),
    ('strawberrybasil@test.com', 'password');

INSERT INTO users(user_id, display_name, membership_status)
VALUES
    (1, 'learningcircleuser', 'none'),
    (2, 'testuser', 'pending');


INSERT INTO users(user_id, display_name, membership_status, membership_start_date, membership_end_date, cancel_at)
VALUES
    (3, 'StrawberryBasilFan', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + interval '30 days', CURRENT_TIMESTAMP + interval '7 days');

INSERT INTO posts(title, description, body, author_id, is_premium)
VALUES
    ('Strawberry Basil Soda', 'My first post! Try it out~', 'I just made some Strawberry Basil soda and it was really good! I used Strawberries, Sugar, Basil, and Sparkling Water. Please try it sometime!', 3, true),
    ('How to Laliho', 'Master the Laliho greeting!', 'Hello! Welcome to my first post about the dwarf greeting, Laliho! Just say laliHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!', 2, false);

INSERT INTO comments(body, post_id, author_id, is_reply)
VALUES
    ('This is a really great post about strawberry soda', 1, 2, false),
    ('I learned so much reading this.', 1, 1, false),
    ('It''s been my recent favorite! Thanks for reading.', 1, 3, true),
    ('Thank you! Glad you enjoyed it.', 1, 3, true);

INSERT INTO replies(comment_id, reply_to_comment_id)
VALUES
    (3, 1),
    (4, 2);

INSERT INTO bookmarks(post_id, user_id)
VALUES
    (1, 3),
    (2, 3);

\c "learning_circle_test"

CREATE TABLE user_auth (
  id SERIAL PRIMARY KEY,
  email VARCHAR (25) UNIQUE NOT NULL,
  hashed_pwd VARCHAR (100) NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE users (
  user_id INT NOT NULL PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  display_name VARCHAR (30) UNIQUE NOT NULL,
  membership_status VARCHAR (50) NOT NULL DEFAULT 'none',
  membership_start_date TIMESTAMP WITH TIME ZONE,
  membership_end_date TIMESTAMP WITH TIME ZONE,
  last_submission_date TIMESTAMP WITH TIME ZONE,
  customer_id TEXT,
  subscription_id TEXT
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255) NOT NULL,
  description VARCHAR (255),
  body VARCHAR (10000),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  author_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookmarks (
  post_id INT NOT NULL REFERENCES posts ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  body VARCHAR(5000) NOT NULL,
  post_id INT NOT NULL REFERENCES posts ON DELETE CASCADE,
  author_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_reply BOOLEAN NOT NULL
);

CREATE TABLE replies (
  comment_id INT NOT NULL REFERENCES comments ON DELETE CASCADE,
  reply_to_comment_id INT NOT NULL REFERENCES comments ON DELETE CASCADE
);