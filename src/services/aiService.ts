import { Message } from '../types';

// Function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Function to send message to external API
export const sendMessage = async (content: string): Promise<Message> => {
  try {
    // Encode the user message for the query string
    const encodedMessage = encodeURIComponent(content);
    const apiUrl = `https://api.powerboot.io/v2/d161d4e8-3e6a-421d-a234-6a5a1b78dca3?message=${encodedMessage}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.text();
    
    return {
      id: generateId(),
      content: data,
      role: 'assistant',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      id: generateId(),
      content: "I'm sorry, I encountered an error processing your request. Please try again later.",
      role: 'assistant',
      timestamp: new Date()
    };
  }
};

// Function to extract blog plan from conversation
export const extractBlogPlan = (messages: Message[]) => {
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
