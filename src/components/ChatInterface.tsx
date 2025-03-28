import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Copy, CheckCheck, RefreshCw, Loader2 } from 'lucide-react';
import { Message, BlogPlan } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  blogPlan: BlogPlan | null;
  onNewConversation: () => void;
  isAiResponding: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage,
  blogPlan,
  onNewConversation,
  isAiResponding
}) => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isAiResponding) {
      onSendMessage(input);
      setInput('');
    }
  };

  const copyToClipboard = () => {
    if (!blogPlan) return;
    
    const planText = `
Blog Plan: ${blogPlan.title}
Description: ${blogPlan.description}
Target Audience: ${blogPlan.targetAudience}
Topics: ${blogPlan.topics.join(', ')}
Schedule: ${blogPlan.schedule}
    `.trim();
    
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPlan = () => {
    if (!blogPlan) return;
    
    const planText = `
# Blog Plan: ${blogPlan.title}

## Description
${blogPlan.description}

## Target Audience
${blogPlan.targetAudience}

## Topics
${blogPlan.topics.map(topic => `- ${topic}`).join('\n')}

## Schedule
${blogPlan.schedule}
    `.trim();
    
    const blob = new Blob([planText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blogPlan.title.toLowerCase().replace(/\s+/g, '-')}-plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-3 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Chat with AI</h2>
        <button
          onClick={onNewConversation}
          disabled={isAiResponding}
          className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isAiResponding ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />
          New Conversation
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 max-w-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Blog Planner AI</h3>
              <p className="text-gray-500">
                I'm here to help you plan your blog. Tell me about your blog idea, target audience, 
                or ask for suggestions on topics and content strategy.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isAiResponding && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-4 flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin text-indigo-600" />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {blogPlan && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">Your Blog Plan</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                title="Copy to clipboard"
              >
                {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={downloadPlan}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                title="Download as markdown"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-sm">
            <div className="font-semibold">{blogPlan.title}</div>
            <div className="mt-1 text-gray-600">{blogPlan.description}</div>
            {blogPlan.topics.length > 0 && (
              <div className="mt-2">
                <span className="font-medium">Topics:</span>{" "}
                <div className="flex flex-wrap gap-1 mt-1">
                  {blogPlan.topics.map((topic, i) => (
                    <span key={i} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about blog planning, content ideas, or audience targeting..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isAiResponding}
          />
          <button
            type="submit"
            disabled={isAiResponding || !input.trim()}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isAiResponding || !input.trim() 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isAiResponding ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
