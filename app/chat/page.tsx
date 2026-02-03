'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Send, Paperclip, Bot, User, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Lazy initialization of Supabase client
let supabaseInstance: SupabaseClient | null = null;
function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Thread {
  id: string;
  title: string;
  updated_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/login';
      }
    };
    getUserId();
  }, []);

  // Load threads when userId is available
  useEffect(() => {
    if (userId) {
      fetchThreads();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchThreads = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/chat-threads?userId=${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to fetch threads:', data);
        setError(data.details || data.error || 'Failed to load conversations. Please check your setup.');
        return;
      }
      
      if (data.threads) {
        setThreads(data.threads);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      setError('Failed to connect to server. Please check your internet connection.');
    }
  }, [userId]);

  const createNewThread = async () => {
    if (!userId) return null;

    try {
      const response = await fetch('/api/chat-threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: 'New Conversation' }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to create thread:', data);
        setError(data.details || data.error || 'Failed to create conversation.');
        return null;
      }
      
      if (data.thread) {
        setThreads([data.thread, ...threads]);
        return data.thread.id;
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      setError('Failed to create conversation. Please try again.');
    }
    return null;
  };

  const handleSelectThread = async (threadId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/chat-messages?threadId=${threadId}&userId=${userId}`);
      const data = await response.json();
      
      if (data.messages) {
        const formattedMessages = data.messages
          .filter((msg: any) => msg.role !== 'system')
          .map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          }));
        setMessages(formattedMessages);
        setCurrentThreadId(threadId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !userId) return;
    
    setError('');
    
    // Create new thread if needed
    let threadId = currentThreadId;
    if (!threadId) {
      threadId = await createNewThread();
      if (!threadId) {
        setError('Failed to create conversation thread');
        return;
      }
      setCurrentThreadId(threadId);
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/deepseek-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          threadId,
          userId,
          userMessage: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message) {
        const botMessage: Message = { 
          role: 'assistant', 
          content: formatMessage(data.message) 
        };
        setMessages((prev) => [...prev, botMessage]);
        
        // Refresh threads list to update timestamps
        fetchThreads();
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Create new thread if needed
    let threadId = currentThreadId;
    if (!threadId) {
      threadId = await createNewThread();
      if (!threadId) {
        setError('Failed to create conversation thread');
        return;
      }
      setCurrentThreadId(threadId);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('threadId', threadId);
      formData.append('userId', userId);

      const response = await fetch('/api/chat-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Add a message indicating file upload
      const fileMessage: Message = { 
        role: 'user', 
        content: `Uploaded file: ${file.name}` 
      };
      setMessages((prev) => [...prev, fileMessage]);
      
      // Optionally show extraction status
      setError('');
      console.log('File uploaded successfully:', data);
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (message: string) => {
    return DOMPurify.sanitize(
      message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>')
        .replace(/## (.*?)\n/g, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
        .replace(/# (.*?)\n/g, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>')
        .replace(/- (.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-[var(--neutral-100)] p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code class="bg-[var(--neutral-100)] px-1.5 py-0.5 rounded text-sm">$1</code>')
        .replace(/\n/g, '<br />')
    );
  };

  // Convert threads to format expected by Sidebar
  const conversations = threads.map(thread => ({
    id: thread.id,
    message: thread.title,
  }));

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar 
        conversations={conversations} 
        onSelectConversation={handleSelectThread} 
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar />

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-20 h-20 bg-[var(--primary-100)] rounded-2xl flex items-center justify-center mb-6">
                  <Bot size={40} className="text-[var(--primary-600)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--primary-900)] mb-2">
                  Vivace AI Assistant
                </h2>
                <p className="text-[var(--neutral-600)] max-w-md mb-8">
                  Ask me anything about music theory, Trinity College London preparation, or get help with your musical journey.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    'Explain circle of fifths',
                    'Help with Grade 5 theory',
                    'Chord progressions basics',
                    'Sight-reading tips'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-3 text-sm text-left bg-white border border-[var(--neutral-200)] rounded-lg hover:border-[var(--primary-300)] hover:bg-[var(--primary-50)] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      msg.role === 'user' 
                        ? 'bg-[var(--primary-600)]' 
                        : 'bg-[var(--secondary-100)]'
                    }`}>
                      {msg.role === 'user' 
                        ? <User size={20} className="text-white" />
                        : <Bot size={20} className="text-[var(--secondary-700)]" />
                      }
                    </div>
                    <div
                      className={`flex-1 max-w-[80%] rounded-2xl px-5 py-4 ${
                        msg.role === 'user'
                          ? 'bg-[var(--primary-600)] text-white ml-auto'
                          : 'bg-white border border-[var(--neutral-200)] text-[var(--neutral-800)]'
                      }`}
                    >
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--secondary-100)] flex items-center justify-center">
                      <Bot size={20} className="text-[var(--secondary-700)]" />
                    </div>
                    <div className="bg-white border border-[var(--neutral-200)] rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-2 text-[var(--neutral-500)]">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <div className="border-t border-[var(--neutral-200)] bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-[var(--neutral-300)] rounded-xl bg-white text-[var(--neutral-900)] placeholder-[var(--neutral-400)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 focus:outline-none resize-none transition-all"
                  placeholder="Ask a question about music..."
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>

              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="shrink-0 p-3 rounded-xl bg-[var(--neutral-100)] hover:bg-[var(--neutral-200)] text-[var(--neutral-600)] cursor-pointer transition-colors"
                title="Attach file (PDF, PNG, JPEG)"
              >
                <Paperclip size={20} />
              </label>

              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="shrink-0 p-3 rounded-xl bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>
            
            <p className="mt-3 text-xs text-center text-[var(--neutral-400)]">
              Vivace AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
