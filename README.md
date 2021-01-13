# Welcome to Bloggies!

Bloggies is a blog post web application developed primarily in TypeScript; Express.js and React.js.

# Functionalities
As a users, they can 
-  read posts
- search for blog posts and users based on the post **author name** and the **post's title and description**.
- sort the Homepage's blog lists by **most recent (default)**, **most favorited**, and **least favorited**.
-  view user profiles
- create an account
- login an account
- logout an account. 
	
As a **registered** user, they can
- create a post
- edit/delete their posts
- favorite posts
- write comments
- reply to comments.

# Technologies
bloggies_frontend
		
	TypeScript 4.0.3
	React 17.0.1
	react-dom 17.0.1
	react-router-dom 5.2.0
	redux 4.0.5
	react-redux 7.2.2
	redux-thunk 6.0.0
	redux-persist 6.0.0
	react-bootstrap 1.4.3
	moment 4.0.5

bloggies_backend

	TypeScript 4.1.3
	ts-node 9.1.1
	Express 4.17.1
	Json Web Token 8.5.1
	Bcrypt 5.0.0
	pg 8.5.1
	ts-jest 26.4.4 
	Supertest 6.0.1
bloggies_database

	PostgreSQL

# Installation
To run this project, download or clone this repository to get the `bloggies_backend` and `bloggies_frontend` files.
To setup the **backend** run the following commands in the command line (from the root directory):
	
	$ cd bloggies_backend
	$ npm install
	$ cd src/
	$ psql < data.sql	**NOTE: This will not create the test database.
								To create the test database, go open `data.sql`
								and change "bloggies" to "bloggest_test", save
								`data.sql` and re-run the command. **
	$ npm start			**code will be on localhost:5000**
**To run backend tests, run `$ npm test` in `bloggies_backend/`**

To setup the **frontend** run the following commands in the command line (from the root directory):

	$ cd bloggies_frontend
	$ yarn add yarn.lock
	$ npm start  		**code will be on localhost:3000**

#  Architecture Pattern
The architecture pattern that Bloggies (as a whole) is created upon is the **Layered Architecture**.

## Frontend Architecture
Bloggies' frontend is a **Single Page Application** using React. The frontend utilizes a form of seperation through **seperation by UI component** and each component is written with their related functioning logic included. Depending on the components, Bloggies' **higher-order** components are more likely to contain heavier logic to pass down their child components in order to keep **lower-order** components *reuseable and flexible* and be maintable as the project grows in the future.

Data in the frontend is handled by a state management library, **Redux**, through a Provider that enables application-wide access to a Store of states. Every component under the Provider have the ability to subscribe to read the Store's states and dispatch actions to alter the the states of the Store. Global state management was used in order to **reduce propdrilling**. **Redux** was chosen as the favorable global state management over React's `useContext` hook because Redux state can be persisted with the use of `redux-persist` library and by doing so, a user can be logged in despite ending a session without needing to do additional API calls by persisting the user-related data: `user object` and `favorites array`. Another advantage of using Redux is the usage of action creators and a rootReducer, which allows the code to be more organized by creating modular action creators and a main rootReducer that deals with only changing the global state object (the store).

Routes were originally written to be seperated by `PublicRoutes/` and `PrivateRoutes/`, however it was changed to just `Routes/` because only the `ComposePage` component requires a user to be logged in to access.

## Backend Architecture
Within the backend code, files are seperated by `routes/` , that allows frontend code to request data from available endpoints,  and `models/`, which allows view functions to invoke a model's class method(s) to access the PostgreSQL database (through the `pg` library). 
> In summary, the backend architecture utilizes the **repository pattern**.

To create API endpoints, `Express` was used. `routes/` were seperated by `resource` (RESTful) and uses proper HTTP verbs for each CRUD operation. Each file in `models/` is a Class representing a table (join tables excluded) in the Database Schema: `users`, `posts`, `favorites`, and `comments`. These model classes have class methods to be invoked within the view functions of `routes/`. Each class method was written to perform a single query to simplify as much as possible. 

## Database Schema (PSQL)
![bloggies_database_schema](https://i.imgur.com/qTdSjmJ.png)

When planning the database schema, a couple points were kept in mind:
1. Reduce unnecessary columns 
	- Although having such columns can make it easier to write queries for, extra columns in the long run can take up extra space and thus, increasing costs and maintenance. Unnecessary columns are data columns that can be obtained through a more complex SQL query using `JOIN`'s and `GROUP BY`'s. For example, getting the `number of favorites` for a post. 
2. Data required for specific functionalities
	- Since Bloggies was a project that had a base functionality guideline, tables and columns were designed to meet the needs of those functionalities. In addition to those, Bloggies was planned to also have a commenting and reply functionality as well and their tables were designed to be able to scale for the commenting depth (in case Bloggies was to implement a reddit-style commenting system).
3. User satisfaction
	- When thinking of data to store, a user's perspective was used to think of what informations were too much to provide and what type of data they would like to view in the application. User registration information required was reduced to `username` , `password` and a `display_name`. The `join_date` would allow users to be able to differentiate between each other when searching for a user using the **search function**, as the `display_name` is not unique and the user's `username` is only used for authentication purposes.

Bloggies' database is composed of five tables: 
1. **users** - The `users` table keeps a registered user's information. 
						- For authentication, a user must have a `username` and password (that is saved as a `hashed_pwd`) to login.
						- The `display_name` is used as the user's display name when using Bloggies' functionalities.
						- The `join_date` is used in when searching for a specific user in the search function and is displayed when a user appears as a search result.
	>**users relationships to other tables:**
	- `users` *one-to-many* && *many-to-many* `posts`,
	- `users` *one-to-many* `favorites`,
	- `users` *one-to-many* `comments`
				
2. **posts** - The `posts` table keeps a blog post's data.
					- `title` is a required column in order to create a post. 
					- `description` is a short 'sub-title' to the blog post and is optional.
					- `body`of a post is used as the main article of the blog post and is optional.
					- An `author_id` is required to create a post because only registered users may 	create posts.
					- `created_at` and `last_updated_at` are timestamps to show users how old a post is and when the post was last updated. This will also allow users to sort the posts by most recents.
	>**posts relationships to other tables:**
	- `posts` *one-to-many* `favorites`,
	- `posts` *one-to-many* `comments`,
	- `posts` *many-to-one* && *many-to-many* `users`
				
3. **favorites** - The `favorites` table is a **join** table between the `users` and `posts` for a user favoriting a post. (ex. *a user may have many favorited posts and a post may have many favorites by users.*) 
				- A unique pair of `post_id` and `user_id` is kept in this table to ensure that a user may only like a specific post once at a time. 
				- A `GROUP BY` query will be able to show the number of favorites a post has and sort by most/least favorited.
4. **comments** - The `comments` table stores all comments to a post.
							- `author_id` is required to make a comment. Only logged in users may comment.
							- `post_id` is required since a comment may only be made to a post.
							- `body` is a required column and is the comment's text/main content.
							- `created_at` is a timestamp that shows users when a comment was made.
							- `is_reply` is a boolean that denotes whether a comment was made as a comment to a post or a comment to another comment (a **reply**)
	>**comments relationships to other tables:**
	- `comments` *many-to-one* `users`,
	- `comments` *many-to-one* `posts`,
	- `comments` *one-to-many* `replies`
5. **replies**- The `replies` table stores two foreign keys related to the `comments`'s `id` column. 
					- `comment_id` is the `id` of the **reply comment**
					- `reply_to_comment_id` is the `id` of the comment the `replies.comment_id` is meant to be a reply for. `reply_to_comment_id` is an `id` from the `comments` table.
	>**replies relationships to other tables:**
	- `replies` *one-to-many* `comments`

**NOTE: A reply cannot be made to a reply comment. Not just yet... :D**

## React Components
![bloggies_react_components_diagram](https://i.imgur.com/WbrFQKk.png)

In Bloggies, the diagram above illustrates the components used to develop the frontend UIs.
-
Aside from the components, the following files are also included:
 - `custom.d.ts` : stores customized interfaces for objects such as a
   `Post`, `Comment`, `User`, `PostFormData`, `CustomReduxState`,
   `SearchResults`
 - `helpers.tsx` : stores helper fuctions that are used throughout the project such as `isFavorited()`, `changeToURLFriendly()`, and
   `checkSignUpDateValid()`.
 - `redux/` folder that holds redux-related files of the following: 
				 - `actionCreators.tsx` : stores functions that are used with `dispatch()` to invoke the rootReducer function in `rootReducer.tsx`
				 - `actionTypes.tsx` : stores variables that have a string value to reduce mistakes due to typos
				 - `rootReducer.tsx` : stores the rootReducer function that alters the states within the store

# Testing
Unittests were written for the backend **models** and **routes**. Tests were done using **Jest** and **supertest**. Tests have been written for both "sad" and "happy" paths (handling invalid data and handling valid data).
>To view these test files, they are stored within `bloggies_backend/src/__tests__`. 

1. `user.test.ts` are the tests for the **User model**'s class methods.
2. `usersRoutes.test.ts` are tests for the **users endpoint routes** 
3.  `post.test.ts` are the tests for the **Post model**'s class methods.
4. `postsRoutes.test.ts` are tests for the **posts endpoint routes** 
5. `favorite.test.ts` are the tests for the **Favorite model**'s class methods.
6. `favoritesRoutes.test.ts` are tests for the **favorites endpoint routes** 
7. `comments.test.ts` are the tests for the **Comment model**'s class methods.

## Best Practices 
1. **Add code comments**
		Throughout this application, there has been many complexities built up over the course of development and with complexities, there must be code comments added in order to ease readability for other developers to understand the code at a glance. Every frontend functional components were given an overall description at the top of the functions, as well as helper functions. 
		VSCode allows hovering over a function to view their descriptions in a tooltip, which is extra nice and convenient for understanding imported functions within a file!
2. **Code reusability**
	Within the frontend, components are seperated by UI- with some pieces bigger than others. To decide what components should be made, each component is planned for **reusability** throughout the frontend application. For example, the `BlogList` component is reused by `Homepage` (to show all blog posts), `UserProfile` (to show a user's blog post publications), and `SearchResults` (to show blog posts matching a search term). `BlogForm` is not only used for **creating a new blog post**, but also to make an **edit of an existing blog post**. `CommentCard` is another component that is reused to display comment replies to a comment. 
3. **Code  modulation**
	Bloggies' frontend and backend code has been written based on making modular code. To allow for better backend **unittesting**, database CRUD operations are seperated by the `model`/table it operates upon and seperated further by small class methods. An example of this is seen when creating a `comment` (to a post) and then a `reply comment` (to a comment). Both are creating comments in the `comments table`, but creating a `reply comment` requires an extra step to add a record in the `replies table`. In this case, there are two class methods within the `models/comments.ts`: `.createComment` and `.createReply`. 
	In the frontend, modulation is seen when dealing with Redux code. Within the `redux/` folder, three files are kept to seperate their concerns: `actionCreators.tsx`, `actionTypes.tsx`, and `rootReducer.tsx`. The `actionCreators.tsx` file is responsible for defining functions that is to be passed to `dispatch()` to invoke a change in the global state(s) through the `rootReducer` function. `actionTypes.tsx` have variables that are assigned a string value in order to **reduce the errors by typos** caused by hard-coded strings.
4. **Following TypeScript Do's and Don'ts, as well as Best Practices**
	Bloggies is the first full TypeScript project the developer has worked on and following these guidelines have helped in learning TypeScript and appreciating the value of TypeScript. For both the frontend and backend, the use of `any` as a type was unfavorable and only to be used when an ambiguous object is expected. Strict configurations has been enabled to use more of TypeScript's potential. The optional operator `?` is used in interfaces. Instead, typing undefined values were done by using union types with  `|`. For example, in the `BlogForm`  frontend component: 
	`post: Post | undefined`
	 

# Bloggies Screenshots and Userflow

HOMEPAGE
![bloggies_homepage](https://i.imgur.com/SDiY6GT.png)
This is the Homepage of Bloggies. The user can click "login" or "sign up" to get authenticated to use most of Bloggies' functions.
>Components shown:
	> SearchBar, NavBar, Homepage, BlogList, SortSelection, BlogCard, FavoriteButton

LOGIN PAGE
![bloggies_login](https://i.imgur.com/SwG669a.png)
This is the Login page for an already registered user, but since the user doesn't have an account yet, they can click "Click here to sign up!" to be redirected to the Register page.
> Components shown:
> Login, LoginForm, NavBar, SearchBar

REGISTER PAGE
![bloggies_register](https://i.imgur.com/gmKQJgQ.png)
The Register page allows the user to register for an account.
Upon successful sign up, the user will be redirected to the Homepage.
> Components shown:
> Register, NavBar, SearchBar, SignUpForm

SIGN UP SUCCESS, REDIRECT TO HOMEPAGE
![bloggies_redirect](https://i.imgur.com/YU1YNjH.png)

The user likes the **Strawberry Basil Soda ** post and successfully favorites the post.
Now the user will click on the **Strawberry Basil Soda**'s card to look at what the post is all about!

POST DETAILS PAGE
![bloggies_post_details](https://i.imgur.com/yOT6vLd.png)

The user can see the entirety of the post's details and even view comments from other users. Our registered user comments "Awesome!" and may write reply comments to comments as well. 
Now the user can press `compose blog` on the top navigation bar.
>Components shown:
>PostDetails, NavBar, SearchBar, CommentList, CommentCard, CommentReplyAccord, CommentForm

COMPOSE PAGE
![bloggies_compose_page](https://i.imgur.com/qR6k3ke.png)
A registered user can write a blog post. The post must at least have a title!
The user clicks "Publish post" and is redirected to the homepage showing the list of blogs.
>Components shown:
>NavBar, SearchBar, ComposePage, BlogForm

![bloggies_show_new_post](https://i.imgur.com/ZdPPfBt.png)
The user's newly posted blog post is up and showing on the homepage! By default, the homepage shows the list of blogs by most recent. To make an update or delete their post, the user must go to the post's detail page.
![bloggies_update](https://i.imgur.com/0qU3t8L.png)
The user clicks on the teal colored button "Edit" to update a post or the red colored button "Delete" to delete the post. When making an edit, a modal pops up and displays a Blog Form that you see when creating a new blog post. Except, this form is passed a post object to allow the user to make edits to their existing post.

*NOTE: Updates and deletes can only happen for posts that the current user owns/published *
> Components shown:
> EditFormModal, BlogForm

![bloggies_update_success](https://i.imgur.com/nDPsGsK.png)
The blog post update is a success! Now there is a `last_updated_at` value shown because the post has been updated. Now, the user tries to delete their post...
![bloggies_delete_conf](https://i.imgur.com/Q45V2F9.png)
The user is prompted a modal to confirm their decision for deleting the post (to ensure their intensions are not by accident). If clicked "Yes", the post will be deleted and redirect the user to the homepage. If clicked "Go back", the modal will close.
>Components Shown:
>DeleteModal

![bloggies_delete_success](https://i.imgur.com/YU1YNjH.png)
The user clicks "Yes" and deletes the post successfully! Now it is gone from the blog list. 
Our user "favorites" **How to Laliho** post and wants to view their favorites. The user clicks "my profile" on the top navigation bar.

![bloggies_user_profile](https://i.imgur.com/PYYOoIw.png) 
In the user profile, the user can view their favorites list and their publications as well! Since the user has deleted their publication, their publications list is empty.
The user wants to search for posts on "strawberry" but they only typed "straw" on the search bar at the top navigation bar.
>Components shown:
> UserProfile, NavBar, SearchBar, FavoritesList, BlogCard, BlogList

![bloggies_search](https://i.imgur.com/g6k81im.png)
Submitting the search will bring the user to the Search Results page, which shows lists of posts and users matching the search term. A post can be searched by it's `title`, `description` (sub-title), and `author_name`. A user can be searched by their `display_name`.
>Components shown:
>SearchResults, NavBar, SearchBar, UserList, BlogCard

![bloggies_user_search](https://i.imgur.com/yMdEln8.png)
Here is an example of searching for 'crystal'. 
The user would like to view Crystal Exarch's user profile! That can be done by clicking on their display name.
>Components shown
> UserCard

![bloggies_other_user_profile](https://i.imgur.com/uNI7H8Z.png)
Just like our user's user profile page, it shows Crystal Exarch's profile page.
>The user can click on the "newsfeed" item on the navigation bar and go to the Homepage.

 But instead, the user creates a new post through the "compose blog" nav item. 
 Upon publish, the user goes to the Homepage.
![bloggies_new_post_sort](https://i.imgur.com/MkriAXt.png)
The user sees the posts listed by "most recent". To change this order, the user can pick between "most favorites", "least favorites" and "most recent" at the dropdown select. 
Here is the **most favorited**: 
![bloggies_most_fav](https://i.imgur.com/B8ywdzp.png)
Here is the **least favorited**:
![bloggies_least_fav](https://i.imgur.com/ZmGuzF4.png)
Here's **most recents**:
![bloggies_most_recent](https://i.imgur.com/U5dKmHq.png)
The user just unfavorited the **Strawberry Basil Soda** post! 
This user can go to their profile by clicking "my profile" on the navigation bar and see their publication and updated favorites list.
![enter image description here](https://i.imgur.com/bGxel2g.png)
When the user clicks "logout" on the navigation bar, the logged in user-related redux data is removed and token is removed from the localStorage. The user is also redirected back to the Homepage after logging out.
