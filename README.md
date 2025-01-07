https://www.youtube.com/watch?v=pmvEgZC55Cg

Supabase Storage:
1. https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
2. https://supabase.com/docs/guides/database/postgres/row-level-security
3. https://supabase.com/docs/guides/getting-started
4. https://supabase.com/docs/guides/storage
5. https://supabase.com/docs/reference/javascript/typescript-support
6. https://supabase.com/docs/guides/api

Cookies
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#strict
- https://www.npmjs.com/package/cookie

TODO
- [X] Sign Up Page
  - [X] BackEnd SignUp Auth

- [X] Sign In Page
  - [X] BackEnd Sign In Auth

- [X] Homepage
    - [X] Download multiple files from supabase
    - [X] query backend for posts
    - [X] Display posts!
    - [X] Like Functionality
    - [X] Save Functionality

- [X] Poeple Page
  - [X] Basic desired UI
  - [X] View Profile Page
    - [X] Fetch users
    - [X] Links to their profile
  - [X] Implement Follows
    - [X] People Stats: follow count 
    - [X] actual function

- [ ] Things that are nice to have
  - [X] Comments under posts
    - [X] Basic UI
    - [X] Functionality
    - [X] Like/Dislike Icons
    - [X] Like/Dislike functionality
    - [X] Like/Dislike Fetching
    - [X] Like/Dislike COunt
    
  - [X] Fix the image resizing from PostDetails (becuz it is ugly)
  - [X] Anonymous user login. 
  - [X] Search For People
  - [X] More follower feature support
    - [X] Homepage: option that allows users to view post only from followed people
      - figure out getFollwing in query.js
    - [X] Followed people page (or just bake it in the people page as a sort option)
  - [X] Allow user to update profile
    - [X] Basic Update Profile UI
    - [X] Separate the meaning o fusername/handle
    - [X] Allow user to edit BIO
    - [X] SignUp: add handle as field
    - [X] Reflect the bio!
    - [X] Profile Pic Updates!
        - [X] All Users
    
  - [ ] Clean Up
    - [ ] prop-types
    - [ ] Detect when the token session ran out and put the user to the auth page
    - [ ] Change token validity from 10min to 7d.
    - [ ] Submit / Deploy!
    
  - [ ] Real Time Chat!
    - Hence, add a private chats page!
    - SocketIO!
  
- [ ] More 
  - [ ] Multiple images
  - [ ] Reply to comments
  - [ ] Delete Posts
