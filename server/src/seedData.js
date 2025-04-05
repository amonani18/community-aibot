const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const CommunityPost = require('./models/CommunityPost');
const HelpRequest = require('./models/HelpRequest');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => console.log(err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await CommunityPost.deleteMany({});
    await HelpRequest.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Create users with valid roles: 'resident', 'business_owner', 'community_organizer'
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Password123', salt);
    
    const users = await User.insertMany([
      {
        username: 'aniket',
        email: 'aniket@example.com',
        password,
        role: 'resident',
        createdAt: new Date('2023-12-15')
      },
      {
        username: 'hema',
        email: 'hema@example.com',
        password,
        role: 'business_owner',
        createdAt: new Date('2023-11-20')
      },
      {
        username: 'aaru',
        email: 'aaru@example.com',
        password,
        role: 'community_organizer',
        createdAt: new Date('2023-10-10')
      },
      {
        username: 'rajesh',
        email: 'rajesh@example.com',
        password,
        role: 'resident',
        createdAt: new Date('2023-12-01')
      },
      {
        username: 'priya',
        email: 'priya@example.com',
        password,
        role: 'business_owner',
        createdAt: new Date('2023-11-05')
      }
    ]);
    
    console.log(`${users.length} users created`);
    
    // Create news posts
    const newsPostsData = [
      {
        title: 'Community Garden Opening Next Month',
        content: 'We are excited to announce that our community garden will be opening next month on April 15th. The garden will feature 20 plots for residents to grow their own vegetables and flowers.\n\nRegistration for garden plots will begin next week. Each plot costs $25 for the season, which covers water usage and access to community gardening tools. \n\nFor more information, please contact the community office or visit our website.',
        category: 'news',
        author: users[0]._id, // Aniket
        createdAt: new Date('2024-03-10'),
      },
      {
        title: 'Upcoming Road Closures Due to Construction',
        content: 'Please be advised that Maple Street will be closed for repaving from April 5th to April 20th. Detours will be clearly marked, and access to residences will be maintained throughout the construction period.\n\nThe construction hours will be from 7:00 AM to 6:00 PM, Monday through Friday. We apologize for any inconvenience this may cause.\n\nIf you have questions or concerns, please contact the Public Works Department at 555-123-4567.',
        category: 'news',
        author: users[1]._id, // Hema
        createdAt: new Date('2024-03-15'),
      },
      {
        title: 'Summer Festival Planning Committee Seeking Volunteers',
        content: 'The Summer Festival Committee is looking for volunteers to help plan and organize our annual community celebration scheduled for July 15-17.\n\nWe need help with various aspects including food vendors, entertainment scheduling, children\'s activities, and general logistics.\n\nIf you\'re interested in joining the planning committee, please attend our next meeting on April 10th at 7:00 PM in the Community Center or email festivals@communityportal.com.',
        category: 'news',
        author: users[2]._id, // Aaru
        createdAt: new Date('2024-03-18'),
      },
      {
        title: 'New Recycling Program Starting in May',
        content: 'The city is launching an expanded recycling program beginning May 1st. The new program will accept a wider range of plastics (types 1-7) and will include curbside pickup of electronics on the last Wednesday of each month.\n\nEvery household will receive a new blue recycling bin by April 25th, along with detailed information about the program.\n\nPlease attend the informational session on April 20th at the Community Center to learn more about proper recycling practices.',
        category: 'news',
        author: users[3]._id, // Rajesh
        createdAt: new Date('2024-03-20'),
      },
      {
        title: 'Local School Achieves Excellence Award',
        content: 'Congratulations to Springfield Elementary School for receiving the National Excellence in Education Award! The school was recognized for its innovative STEM curriculum and community involvement programs.\n\nPrincipal Janet Smith accepted the award at a ceremony last week, crediting the dedicated teachers, staff, and supportive parents for this achievement.\n\nA community celebration is planned for April 30th at the school auditorium. All residents are welcome to attend and celebrate this remarkable accomplishment.',
        category: 'news',
        author: users[4]._id, // Priya
        createdAt: new Date('2024-03-22'),
      }
    ];
    
    const newsPosts = await CommunityPost.insertMany(newsPostsData);
    console.log(`${newsPosts.length} news posts created`);
    
    // Create discussion posts (some linked to news)
    const discussionPostsData = [
      {
        title: 'What vegetables are you planning to grow in the community garden?',
        content: 'I just signed up for a plot in the new community garden and I\'m excited to start planting! I\'m thinking of growing tomatoes, cucumbers, and some herbs.\n\nWhat is everyone else planning to grow? Any tips for a first-time gardener? I\'d love to hear your suggestions for what grows well in our climate.',
        category: 'discussion',
        author: users[1]._id, // Hema
        linkedDiscussionId: newsPosts[0]._id, // Linked to garden news
        createdAt: new Date('2024-03-12'),
        participants: [users[1]._id, users[2]._id, users[3]._id] // Hema, Aaru, Rajesh
      },
      {
        title: 'Alternative routes during road closure',
        content: 'With Maple Street closing for construction, I\'m trying to figure out the best alternative route to get to work. I normally take Maple to Oak Street.\n\nHas anyone mapped out efficient detours yet? I\'m particularly concerned about morning rush hour traffic.',
        category: 'discussion',
        author: users[0]._id, // Aniket
        linkedDiscussionId: newsPosts[1]._id, // Linked to road closure news
        createdAt: new Date('2024-03-16'),
        participants: [users[0]._id, users[4]._id] // Aniket, Priya
      },
      {
        title: 'Summer Festival Activity Ideas',
        content: 'I\'ve volunteered to help with the Summer Festival this year, and I\'m brainstorming ideas for activities!\n\nSome thoughts so far:\n- Water balloon toss competition\n- Local band showcase\n- Food trucks from local businesses\n- Face painting booth\n- Community art project\n\nWhat would you like to see at the festival this year? Any activities your family particularly enjoys?',
        category: 'discussion',
        author: users[2]._id, // Aaru
        createdAt: new Date('2024-03-19'),
        participants: [users[2]._id, users[0]._id, users[1]._id, users[3]._id] // Aaru, Aniket, Hema, Rajesh
      },
      {
        title: 'Recommendations for local home repair services',
        content: 'I need to get my bathroom renovated and I\'m looking for recommendations for trustworthy and skilled contractors in our area.\n\nHas anyone had good experiences with local companies? Any to avoid? I\'d appreciate any suggestions and rough price estimates if you\'re willing to share.',
        category: 'discussion',
        author: users[3]._id, // Rajesh
        createdAt: new Date('2024-03-14'),
        participants: [users[3]._id, users[4]._id] // Rajesh, Priya
      },
      {
        title: 'Organizing a neighborhood watch program',
        content: 'There have been a few reports of suspicious activities in our neighborhood lately, and I think it might be time to organize a more formal neighborhood watch program.\n\nDoes anyone have experience setting something like this up? I\'d be happy to coordinate an initial meeting if there\'s interest.\n\nI think increasing our community vigilance would benefit everyone and strengthen our neighborhood bonds.',
        category: 'discussion',
        author: users[4]._id, // Priya
        createdAt: new Date('2024-03-17'),
        participants: [users[4]._id, users[0]._id, users[2]._id] // Priya, Aniket, Aaru
      }
    ];
    
    const discussionPosts = await CommunityPost.insertMany(discussionPostsData);
    console.log(`${discussionPosts.length} discussion posts created`);
    
    // Create help requests
    const helpRequestsData = [
      {
        description: 'Need help moving furniture this weekend',
        author: users[0]._id, // Aniket
        createdAt: new Date('2024-03-21')
      },
      {
        description: 'Looking for someone to walk my dog for the next week while I recover from surgery',
        author: users[1]._id, // Hema
        createdAt: new Date('2024-03-22')
      },
      {
        description: 'Computer troubleshooting needed - my laptop won\'t boot up',
        author: users[2]._id, // Aaru
        createdAt: new Date('2024-03-18')
      },
      {
        description: 'Looking for math tutor for my 8th-grade son',
        author: users[4]._id, // Priya
        createdAt: new Date('2024-03-23')
      }
    ];
    
    const helpRequests = await HelpRequest.insertMany(helpRequestsData);
    console.log(`${helpRequests.length} help requests created`);
    
    console.log('Seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected after seeding');
  }
};

// Run the seed function
seedData(); 