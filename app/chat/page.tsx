'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { SendHorizonal } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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

      if (!response.ok || !response.body) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });

        // Parse the JSON response to extract the message
        try {
          const jsonResponse = JSON.parse(result);
          if (jsonResponse.message) {
            const botMessage: Message = { role: 'assistant', content: formatMessage(jsonResponse.message) };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    } catch (error) {
      setError('Failed to fetch response. Please try again.');
      console.error('Chatbot error:', error);
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
    return DOMPurify.sanitize(message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/### (.*?)\n/g, '<h3>$1</h3>')
      .replace(/## (.*?)\n/g, '<h2>$1</h2>')
      .replace(/# (.*?)\n/g, '<h1>$1</h1>')
      .replace(/- (.*?)(?=\n|$)/g, '<ul><li>$1</li></ul>')
      .replace(/\n/g, '<br />'));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:p-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-purple-700 text-center md:text-left">
        🧠 Vivace AI Chatbot
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="border border-gray-300 p-4 rounded-lg mb-4 flex-grow overflow-y-auto bg-white shadow-lg max-h-[500px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex items-center ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            aria-live="polite"
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === 'user' ? 'bg-purple-300' : 'bg-gray-200'
              }`}
              style={{ color: 'black' }}
            >
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="p-3 rounded-lg bg-purple-200" style={{ color: 'black' }}>
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow p-3 border-r border-gray-300 focus:outline-none"
          placeholder="Type your message..."
          style={{ color: 'black' }}
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          className="p-3 bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
          aria-label="Send message"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}
