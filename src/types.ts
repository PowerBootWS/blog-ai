export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface BlogPlan {
  title: string;
  description: string;
  topics: string[];
  schedule: string;
  targetAudience: string;
}
