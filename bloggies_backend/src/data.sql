DROP DATABASE IF EXISTS "bloggies";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "posts";
DROP TABLE IF EXISTS "comments";
DROP TABLE IF EXISTS "replies";
DROP TABLE IF EXISTS "favorites";

CREATE DATABASE "bloggies";

\c "bloggies"

CREATE TABLE users ( 
  id SERIAL PRIMARY KEY,
  username VARCHAR (25) UNIQUE NOT NULL,
  display_name VARCHAR (30) NOT NULL,
  hashed_pwd VARCHAR (100) NOT NULL,
  photo_url TEXT,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY, 
  title VARCHAR (255) NOT NULL, 
  description VARCHAR (255),
  body VARCHAR (10000),
  author_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE favorites (
  post_id INT NOT NULL REFERENCES posts ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

INSERT INTO users (username, display_name, hashed_pwd) 
VALUES 
    ('GrahaTia',  'Crystal Exarch', 'password'),
    ('Ronitt', 'La-laliho', 'password'),
    ('namazu', 'UwU Namazu', 'password');

INSERT INTO posts(title, description, body, author_id) 
VALUES
    ('Strawberry Basil Soda', 'My first post! Try it out~', 'I just made some Strawberry Basil soda and it was really good! I used Strawberries, Sugar, Basil, and Sparkling Water. Please try it sometime!', 1),
    ('How to Laliho', 'Master the Laliho greeting!', 'Hello! Welcome to my first post about the dwarf greeting, Laliho! Just say laliHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!!', 2);

INSERT INTO comments(body, post_id, author_id, is_reply) 
VALUES
    ('This is a really great post about strawberry soda', 1, 2, false),
    ('I learned so much reading this.', 1, 3, false),
    ('It''s been my recent favorite! Thanks for reading.', 1, 1, true),
    ('Thank you! Glad you enjoyed it.', 1, 1, true);

INSERT INTO replies(comment_id, reply_to_comment_id) 
VALUES
    (3, 1),
    (4, 2);

INSERT INTO favorites(post_id, user_id) 
VALUES
    (1, 3),
    (2, 3);