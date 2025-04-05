const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');
const HelpRequest = require('../models/HelpRequest');
const aiResolvers = require('./aiResolvers');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return user; // User is already fetched from the database in the auth middleware
    },
    users: async () => {
      return User.find();
    },
    user: async (_, { id }) => {
      return User.findById(id);
    },
    communityPosts: async (_, { category, userId }) => {
      // Build filter based on category and/or userId
      let filter = {};
      
      if (category) {
        filter.category = category;
      }
      
      if (userId) {
        filter.author = userId;
      }
      
      return CommunityPost.find(filter).populate('author').populate('participants');
    },
    communityPost: async (_, { id }) => {
      return CommunityPost.findById(id).populate('author').populate('participants');
    },
    helpRequests: async (_, { userId }) => {
      // If userId is provided, filter by that author
      const filter = userId ? { author: userId } : {};
      return HelpRequest.find(filter).populate('author');
    },
    helpRequest: async (_, { id }) => {
      return HelpRequest.findById(id).populate('author');
    },
    ...aiResolvers.Query
  },

  Mutation: {
    register: async (_, { username, email, password, role }) => {
      const user = await User.create({ username, email, password, role });
      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
      );
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      
      const isValid = await user.comparePassword(password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
      );
      return { token, user };
    },

    logout: () => true,

    createCommunityPost: async (_, { title, content, category, linkedDiscussionId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const post = await CommunityPost.create({
        title,
        content,
        category,
        linkedDiscussionId,
        author: user.id,
        participants: category === 'discussion' ? [user.id] : [] // Add author as first participant for discussions
      });
      
      // Populate the author field before returning
      return await CommunityPost.findById(post.id).populate('author').populate('participants');
    },

    updateCommunityPost: async (_, { id, title, content, category, linkedDiscussionId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Post not found');
      if (post.author.toString() !== user.id) throw new Error('Not authorized');
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (category !== undefined) updateData.category = category;
      if (linkedDiscussionId !== undefined) updateData.linkedDiscussionId = linkedDiscussionId;
      
      Object.assign(post, updateData);
      await post.save();
      
      return await CommunityPost.findById(post.id).populate('author').populate('participants');
    },

    deleteCommunityPost: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Post not found');
      if (post.author.toString() !== user.id) throw new Error('Not authorized');
      
      await post.deleteOne();
      return true;
    },

    joinDiscussion: async (_, { postId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const post = await CommunityPost.findById(postId);
      if (!post) throw new Error('Post not found');
      if (post.category !== 'discussion') throw new Error('This post is not a discussion');
      
      if (!post.participants.includes(user.id)) {
        post.participants.push(user.id);
        await post.save();
      }
      
      return await CommunityPost.findById(post.id).populate('author').populate('participants');
    },

    leaveDiscussion: async (_, { postId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const post = await CommunityPost.findById(postId);
      if (!post) throw new Error('Post not found');
      if (post.category !== 'discussion') throw new Error('This post is not a discussion');
      
      post.participants = post.participants.filter(id => id.toString() !== user.id);
      await post.save();
      
      return await CommunityPost.findById(post.id).populate('author').populate('participants');
    },

    createHelpRequest: async (_, { description, location }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const helpRequest = await HelpRequest.create({
        description,
        location,
        author: user.id
      });
      
      return await HelpRequest.findById(helpRequest.id).populate('author');
    },

    updateHelpRequest: async (_, { id, description, location }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');
      if (helpRequest.author.toString() !== user.id) throw new Error('Not authorized');
      
      const updateData = {};
      if (description !== undefined) updateData.description = description;
      if (location !== undefined) updateData.location = location;
      
      Object.assign(helpRequest, updateData);
      await helpRequest.save();
      
      return await HelpRequest.findById(helpRequest.id).populate('author');
    },

    deleteHelpRequest: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');
      if (helpRequest.author.toString() !== user.id) throw new Error('Not authorized');
      
      await helpRequest.deleteOne();
      return true;
    }
  }
};

module.exports = resolvers; 