const { GoogleGenAI } = require("@google/genai");
const CommunityPost = require('../models/CommunityPost');
const AIInteraction = require('../models/AIInteraction');

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to clean up the AI response text
function cleanResponseText(text) {
  // Remove markdown code block formatting if present
  return text
    .replace(/^```json\n/, '')  // Remove opening ```json
    .replace(/^```\n/, '')      // Remove opening ``` if no language specified
    .replace(/\n```$/, '')      // Remove closing ```
    .trim();                    // Remove any extra whitespace
}

// Helper function to calculate text similarity score
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\W+/);
  const words2 = text2.toLowerCase().split(/\W+/);
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

// Helper function to format post for context
function formatPostForContext(post, similarity = null) {
  return `
Title: ${post.title || ''}
Author: ${post.author?.username || 'Unknown'}
Category: ${post.category || ''}
Content: ${post.content || ''}
${similarity !== null ? `Relevance: ${(similarity * 100).toFixed(1)}%` : ''}
---`;
}

// Helper function to transform post for response
function transformPost(post) {
  if (!post) return null;
  return {
    id: post._id?.toString() || '',
    title: post.title || '',
    content: post.content || '',
    category: post.category || '',
    author: post.author ? {
      id: post.author._id?.toString() || '',
      username: post.author.username || ''
    } : null,
    createdAt: post.createdAt || new Date(),
    updatedAt: post.updatedAt || new Date()
  };
}

async function generateAIResponse(userId, query, communityPosts) {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid query provided');
    }

    // Ensure communityPosts is an array and transform posts
    const validPosts = (communityPosts || []).filter(post => post && post.title && post.content);

    // Sort posts by relevance and add similarity scores
    const postsWithRelevance = validPosts.map(post => ({
      post: transformPost(post),
      similarity: calculateSimilarity(query, `${post.title} ${post.content}`)
    })).sort((a, b) => b.similarity - a.similarity);

    // Create context from community posts with more structure and relevance scores
    const context = postsWithRelevance
      .map(({ post, similarity }) => formatPostForContext(post, similarity))
      .join('\n');

    // Create a more detailed prompt with better instructions
    const prompt = `You are an AI assistant for a community portal. Your role is to help users by providing relevant information from community discussions and engaging them in meaningful conversation.

Current Community Discussions (sorted by relevance to the query):
${context}

User Query: "${query}"

Instructions:
1. Focus on the most relevant posts (those with higher relevance percentages)
2. Provide a direct, specific response that addresses the user's question
3. Reference specific posts and their authors when relevant
4. If no posts are highly relevant, acknowledge this and provide general guidance
5. Suggest follow-up questions based on both the query and available information

Important: Ensure your response is unique and specifically tailored to the query. Do not provide generic responses.

Format your response as a JSON object with the following structure (do not include any markdown formatting):
{
  "response": "Your detailed, contextual response here",
  "followUpQuestions": [
    "A specific follow-up question based on your response",
    "Another relevant question that explores related topics",
    "A question that helps clarify or expand the discussion"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      generationConfig: {
        temperature: 0.9,
        topK: 20,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    });

    const text = cleanResponseText(response.text);
    console.log('User Query:', query); // For debugging
    console.log('Cleaned response text:', text); // For debugging
    
    // Validate and parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
      if (!parsedResponse.response || !Array.isArray(parsedResponse.followUpQuestions)) {
        throw new Error('Invalid response format from AI');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw AI response:', text);
      throw new Error('Failed to parse AI response');
    }

    // Store the interaction
    try {
      await AIInteraction.create({
        userId,
        query,
        response: parsedResponse.response
      });
    } catch (dbError) {
      console.error('Error storing AI interaction:', dbError);
      // Don't throw here, as we still want to return the response to the user
    }

    // Return only the most relevant posts with the response
    const relevantPosts = postsWithRelevance
      .filter(item => item.similarity > 0.1) // Only include posts with some relevance
      .slice(0, 5) // Limit to top 5 most relevant posts
      .map(item => item.post);

    return {
      text: parsedResponse.response,
      suggestedQuestions: parsedResponse.followUpQuestions,
      retrievedPosts: relevantPosts
    };
  } catch (error) {
    console.error('Error in generateAIResponse:', error);
    if (error.message.includes('API key')) {
      throw new Error('AI service configuration error');
    }
    throw new Error('Failed to generate AI response: ' + error.message);
  }
}

async function getRelevantPosts(query) {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid query provided');
    }

    // Get all posts first
    const allPosts = await CommunityPost.find()
      .populate('author')
      .sort({ createdAt: -1 });

    if (!allPosts) {
      throw new Error('Failed to retrieve posts');
    }

    // Calculate relevance scores and transform posts
    const postsWithScores = allPosts.map(post => ({
      post: transformPost(post),
      score: calculateSimilarity(query, `${post.title} ${post.content} ${post.category}`)
    }));

    // Sort by relevance score and get top matches
    const relevantPosts = postsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.post);

    return relevantPosts;
  } catch (error) {
    console.error('Error in getRelevantPosts:', error);
    throw new Error('Failed to retrieve relevant posts: ' + error.message);
  }
}

module.exports = {
  generateAIResponse,
  getRelevantPosts
}; 