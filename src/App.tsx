import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { User, Message, BlogPlan } from './types';
import { login, register } from './services/mockAuth';
import { sendMessage, extractBlogPlan } from './services/mockAI';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blogPlan, setBlogPlan] = useState<BlogPlan | null>(null);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Update blog plan when messages change
  useEffect(() => {
    if (messages.length > 3) {
      const plan = extractBlogPlan(messages);
      if (plan) {
        setBlogPlan(plan);
      }
    }
  }, [messages]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      setUser(loggedInUser);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      const newUser = await register(name, email, password);
      setUser(newUser);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setBlogPlan(null);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Get AI response
    try {
      const aiResponse = await sendMessage(content, [...messages, userMessage]);
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Failed to get AI response', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1 flex items-center justify-center p-4">
        {!user ? (
          <div className="w-full max-w-md">
            <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
            {error && (
              <div className="mt-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden h-[80vh] flex flex-col">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage}
              blogPlan={blogPlan}
            />
          </div>
        )}
      </main>
      
      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} BlogPlannerAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
