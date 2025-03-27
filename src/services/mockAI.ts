import { Message, BlogPlan } from '../types';

// Sample responses for the AI
const responses: Record<string, string> = {
  greeting: "Hello! I'm your blog planning assistant. What kind of blog would you like to create?",
  topic: "That's a great topic! Who is your target audience for this blog?",
  audience: "Perfect. Now, what kind of content schedule are you thinking about? Weekly posts, bi-weekly, or monthly?",
  schedule: "Great plan! Based on our conversation, I've created a blog plan for you. Would you like me to suggest some specific post ideas for your first month?",
  ideas: "Here are some post ideas that could work well for your blog:\n\n1. An introductory post explaining your blog's purpose\n2. A beginner's guide to your main topic\n3. A case study or success story\n4. A how-to tutorial on a specific aspect\n5. A roundup of useful resources\n\nWhat do you think of these ideas?",
  default: "I'm here to help you plan your blog. What specific aspect would you like to discuss next?"
};

// Function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Function to determine the AI response based on user input
const determineResponse = (userInput: string, messageHistory: Message[]): string => {
  const input = userInput.toLowerCase();
  
  if (messageHistory.length === 0 || messageHistory.length === 1) {
    return responses.greeting;
  }
  
  if (input.includes('topic') || input.includes('write about') || input.includes('blog about')) {
    return responses.topic;
  }
  
  if (input.includes('audience') || input.includes('readers') || input.includes('demographic')) {
    return responses.audience;
  }
  
  if (input.includes('schedule') || input.includes('frequency') || input.includes('how often')) {
    return responses.schedule;
  }
  
  if (input.includes('idea') || input.includes('suggestion') || input.includes('recommend')) {
    return responses.ideas;
  }
  
  return responses.default;
};

// Function to extract blog plan from conversation
export const extractBlogPlan = (messages: Message[]): BlogPlan | null => {
  if (messages.length < 4) return null;
  
  let title = "Your New Blog";
  let description = "A blog based on our conversation";
  let topics: string[] = [];
  let schedule = "Weekly posts";
  let targetAudience = "General audience";
  
  // Extract information from the conversation
  for (const message of messages) {
    if (message.role === 'user') {
      const content = message.content.toLowerCase();
      
      // Extract potential blog title
      if (content.includes('blog about') || content.includes('write about')) {
        const match = message.content.match(/(?:blog about|write about)\s+(.+?)(?:\.|\?|$)/i);
        if (match && match[1]) {
          title = match[1].trim();
          description = `A blog about ${title}`;
          
          // Generate some topics based on the title
          const titleWords = title.split(' ').filter(word => word.length > 3);
          if (titleWords.length > 0) {
            topics = [
              `Introduction to ${title}`,
              `Getting Started with ${title}`,
              `Advanced ${titleWords[0]} Techniques`,
              `${title} Best Practices`,
              `${title} Case Studies`
            ];
          }
        }
      }
      
      // Extract target audience
      if (content.includes('audience') || content.includes('readers')) {
        const audienceMatch = message.content.match(/(?:audience is|readers are|for)\s+(.+?)(?:\.|\?|$)/i);
        if (audienceMatch && audienceMatch[1]) {
          targetAudience = audienceMatch[1].trim();
        }
      }
      
      // Extract schedule
      if (content.includes('schedule') || content.includes('post') || content.includes('week')) {
        if (content.includes('weekly')) schedule = 'Weekly posts';
        else if (content.includes('monthly')) schedule = 'Monthly posts';
        else if (content.includes('daily')) schedule = 'Daily posts';
        else if (content.includes('bi-weekly')) schedule = 'Bi-weekly posts';
      }
    }
  }
  
  return {
    title,
    description,
    topics,
    schedule,
    targetAudience
  };
};

export const sendMessage = (content: string, messageHistory: Message[]): Promise<Message> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const response = determineResponse(content, messageHistory);
      resolve({
        id: generateId(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      });
    }, 1000);
  });
};
