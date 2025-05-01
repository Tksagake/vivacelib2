'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { SendHorizonal } from 'lucide-react';
import DOMPurify from 'dompurify';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  message: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, message')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }
      if (data) setConversations(data);
    };

    fetchConversations();
  }, []);

  const handleSelectConversation = async (id: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('message')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching conversation:', error);
      return;
    }
    if (data) {
      setMessages(JSON.parse(data.message));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setError('');
    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/deepseek-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok || !response.body) throw new Error(`Error: ${response.statusText}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });

        try {
          const jsonResponse = JSON.parse(result);
          if (jsonResponse.message) {
            const botMessage: Message = { role: 'assistant', content: formatMessage(jsonResponse.message) };
            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);

            const { data, error } = await supabase
              .from('conversations')
              .insert([{ user_id: 'user-uuid', message: JSON.stringify(finalMessages) }])
              .select();

            if (error) console.error('Error saving conversation:', error);
            else setConversations((prev) => [data![0], ...prev]);
          }
        } catch (e) {
          console.error('JSON parsing error:', e);
        }
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setError('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/# (.*?)\n/g, '<h1>$1</h1>')
        .replace(/- (.*?)(?=\n|$)/g, '<ul><li>$1</li></ul>')
        .replace(/```(.*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br />')
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar conversations={conversations} onSelectConversation={handleSelectConversation} />

      <div className="flex flex-col flex-1 relative">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-2xl p-4 max-w-lg text-sm shadow ${
                  msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl p-4 max-w-lg text-sm bg-gray-100 text-gray-800 animate-pulse">
                Typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </main>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 text-black">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
            >
              <SendHorizonal size={20} />
            </button>
          </div>
          {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
}
