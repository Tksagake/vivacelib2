'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar'; // Adjust the path as necessary
import { SendHorizonal } from 'lucide-react'; // Import Lucide icon

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Error state to show messages if language is not English
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setError(''); // Reset error if the language is valid
    const userMessage = { role: 'user', content: input };
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

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: formatMessage(data.message) }; // Format the message here
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
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

  // Function to format the bot's message and remove markdown
  const formatMessage = (message: string) => {
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/### (.*?)\n/g, '<h3>$1</h3>') // Heading 3
      .replace(/## (.*?)\n/g, '<h2>$1</h2>') // Heading 2
      .replace(/# (.*?)\n/g, '<h1>$1</h1>') // Heading 1
      .replace(/- (.*?)(?=\n|$)/g, '<ul><li>$1</li></ul>') // Bullet points
      .replace(/\n/g, '<br />'); // Line breaks
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col md:p-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-purple-700 text-center md:text-left ">
        🧠 Vivace AI Chatbot
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>} {/* Display error if the language is invalid */}

      {/* Chat container with fixed height and scrollable */}
      <div className="border border-gray-300 p-4 rounded-lg mb-4 flex-grow overflow-y-auto bg-white shadow-lg max-h-[500px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex items-center ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'
              }`}
              style={{ color: 'black' }}
            >
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: msg.content }} // Render the formatted message as HTML
              />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="p-3 rounded-lg bg-gray-200" style={{ color: 'black' }}>
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
        />
        <button
          onClick={handleSend}
          className="p-3 bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}
