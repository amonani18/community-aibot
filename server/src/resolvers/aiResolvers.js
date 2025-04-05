const { generateAIResponse, getRelevantPosts } = require('../utils/aiService');
const AIInteraction = require('../models/AIInteraction');

const aiResolvers = {
  Query: {
    communityAIQuery: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const relevantPosts = await getRelevantPosts(input);
      return await generateAIResponse(context.user.id, input, relevantPosts);
    },

    aiInteractions: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      return await AIInteraction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);
    }
  }
};

module.exports = aiResolvers; 