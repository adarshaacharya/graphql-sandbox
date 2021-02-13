import { Post } from '../../models/Post';
import checkAuth from '../../utils/check-auth';

export const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error('Posts not found');
      }
    },

    async getPost(_, { postId }) {
      try {
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid ID');
        }
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    //create post
    async createPost(_, { body }, context) {
      // context -> req body with header
      const user = checkAuth(context);
      console.log(user);

      const newPost = new Post({
        body,
        user: user._id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', { newPost: post });
      return post;
    },

    //delete post
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    //like post
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      console.log(post.likes);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
};
