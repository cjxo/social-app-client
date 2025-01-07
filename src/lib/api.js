import sb from "./supabase";

const getUrl = (path) => {
  return `http://localhost:3000/${path}`;
};

const fetch2 = async (resource, method, body) => {
  try {
    const response = await fetch(getUrl(resource), {
      method,
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      ok: response.ok,
      ...data,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.stack,
    };
  }
};


// TODO: getAlls are typically bad if
// the DB store alot of instances! So, we might
// need something other that that!
export default {
  user: {
    signUp: async (username, handle, email, password) => {
      const result = await fetch2("auth/sign-up", "POST", { username, handle, email, password })
      sb.storage.create("user-" + result.id);
      return result;
    },
    signIn: async (username, password) => await fetch2("auth/sign-in", "POST", { username, password }),
    isAuth: async () => await fetch2("auth/is-auth", "GET"),
    signOut: async () => await fetch2("auth/sign-out", "POST"),
    anon: async () => {
      const result = await fetch2("auth/anon", "POST");
      sb.storage.create("user-" + result.user.id);
      return result;
    },
    getAll: async () => await fetch2("user/users", "GET"),
    get: async (userId) => await fetch2(`user/users/${userId}`, "GET"),
    getMe: async () => await fetch2(`user/me`, "GET"),
    getStats: async (userId) => await fetch2(`user/users/${userId}/stats`, "GET"),
    followed: async (userId) => await fetch2(`user/users/${userId}/follow`, "GET"),
    follow: async (userId) => await fetch2(`user/users/${userId}/follow`, "POST"),
    unfollow: async (userId) => await fetch2(`user/users/${userId}/follow`, "DELETE"),
    getAllFollowing: async () => await fetch2(`user/follows`, "GET"),
    update: async (username, handle, email, bio, password, imageName, imageType, imageData) => {
      const result = await fetch2(`user/users/me`, "PUT", { username, handle, email, bio, password, imageName });
      if (result.ok && imageName) {
        await sb.storage.upload("user-" + result.newUser.id, imageName, imageType, imageData);
      }
      return result;
    },
  },
  post: {
    insert: async (caption, tags, image_name, image_type, location, image_data) => {
      const result = await fetch2("post/posts", "POST", { caption, tags, image_name, image_type, location });
      if (result.ok) {
        const uploadResult = await sb.storage.upload("user-" + result.author_id, image_name, image_type, image_data);
        result.ok = uploadResult;
      }
      return result;
    },

    update: async (oldPost, caption, tags, image_name, image_type, location, image_data) => {
      const result = await fetch2(`post/posts/${oldPost.id}`, "POST", { caption, tags, image_name, image_type, location });
      console.log(result);
      if (result.ok) {
        const uploadResult = await sb.storage.upload("user-" + result.author_id, image_name, image_type, image_data);
        result.ok = uploadResult;
      }
      return result;
    },

    getAll: async (userId) => {
      const result = await fetch2("post/posts", "GET");
      if (!result.ok) {
        return {
          ...result,
          posts: []
        };
      }
     
      const resultPrime = await sb.storage.addImageBuffers(result.posts);
      return {
        ...result,
        posts: resultPrime
      };
    },

    get: async (postId) => {
      const result = await fetch2(`post/posts/${postId}`, "GET");
      if (!result.ok) {
        return {
          ...result,
          post: null
        };
      }
     
      const resultPrime = await sb.storage.addImageBuffers([result.post]);
      return {
        ...result,
        post: resultPrime[0]
      };
    },

    like: async (postId) => await fetch2(`post/posts/${postId}/like`, "POST"),
    getLikes: async (postId) => await fetch2(`post/posts/${postId}/like`, "GET"),

    save: async (postId) => await fetch2(`post/posts/${postId}/save`, "POST"),
    isSaved: async (postId) => await fetch2(`post/posts/${postId}/save`, "GET"),

    getSaves: async (userId) => {
      /*
      const result = await fetch2("post/posts/save", "GET");
      console.log(result);
      if (!result.ok) {
        return {
          ...result,
          posts: []
        };
      }
     
      const resultPrime = await sb.storage.addImageBuffers(result.posts);
      return {
        ...result,
        posts: resultPrime
      };*/
      let result;
      if (!userId) {
        result = await fetch2("post/saves", "GET");
      } else {
        result = await fetch2(`post/saves/users/${userId}`, "GET");
      }

      if (!result.ok) {
        return {
          ...result,
          posts: []
        };
      }
     
      const resultPrime = await sb.storage.addImageBuffers(result.posts);
      return {
        ...result,
        posts: resultPrime
      };
    },
    
    getFollowing: async (userId) => {
      let result;
      if (!userId) {
        result = await fetch2("post/following", "GET");
      } else {
        result = await fetch2(`post/following/users/${userId}`, "GET");
      }

      if (!result.ok) {
        return {
          ...result,
          posts: []
        };
      }
     
      const resultPrime = await sb.storage.addImageBuffers(result.posts);
      return {
        ...result,
        posts: resultPrime
      };
    },

    getUserPosts: async (userId) => {
      const result = await fetch2(`post/users/${userId}`, "GET");
      if (!result.ok) {
        return {
          ...result,
          posts: []
        };
      }
     
      const resultPrime = await sb.storage.addImageBuffers(result.posts);
      return {
        ...result,
        posts: resultPrime
      };
    },
    
    addComment: async (postId, comment) => await fetch2(`post/posts/${postId}/comments`, "POST", { comment }),
    getComments: async (postId) => await fetch2(`post/posts/${postId}/comments`, "GET"),
    
    likeComment: async (postId, commentId, value) => await fetch2(`post/posts/${postId}/comments/${commentId}/like`, "POST", { value }),
    getCommentsLikeState: async (postId) => await fetch2(`post/posts/${postId}/comments/like`, "GET"),
 },
}
