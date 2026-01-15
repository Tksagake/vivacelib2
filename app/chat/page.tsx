'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Send, Paperclip, Bot, User, Loader2 } from 'lucide-react';
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(`public/${file.name}`, file);

      if (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file. Please try again.');
        return;
      }

      const fileUrl = `${supabaseUrl}/storage/v1/object/public/attachments/${file.name}`;
      const fileMessage: Message = { role: 'user', content: `<a href="${fileUrl}" target="_blank" class="text-[var(--primary-600)] underline">${file.name}</a>` };
      const updatedMessages = [...messages, fileMessage];
      setMessages(updatedMessages);

      const { error: saveError } = await supabase
        .from('conversations')
        .insert([{ user_id: 'user-uuid', message: JSON.stringify(updatedMessages) }]);

      if (saveError) console.error('Error saving conversation:', saveError);
    } catch (err) {
      console.error('File upload error:', err);
      setError('An unexpected error occurred.');
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

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <Sidebar conversations={conversations} onSelectConversation={handleSelectConversation} />

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
                  Ask me anything about music theory, ABRSM preparation, or get help with your musical journey.
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
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="shrink-0 p-3 rounded-xl bg-[var(--neutral-100)] hover:bg-[var(--neutral-200)] text-[var(--neutral-600)] cursor-pointer transition-colors"
                title="Attach file"
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
