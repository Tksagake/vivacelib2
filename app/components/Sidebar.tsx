import React from 'react';
import { MessageSquare, Plus, Clock } from 'lucide-react';

interface SidebarProps {
  conversations: { id: string; message: string }[];
  onSelectConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, onSelectConversation }) => {
  const getConversationPreview = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstUserMessage = parsed.find((m: { role: string }) => m.role === 'user');
        if (firstUserMessage) {
          return firstUserMessage.content.substring(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '');
        }
      }
    } catch {
      // If parsing fails, use the original substring approach
    }
    return message.substring(0, 40) + (message.length > 40 ? '...' : '');
  };

  return (
    <aside className="w-72 bg-[var(--primary-900)] text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-sm font-medium">
          <Plus size={18} />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/50 uppercase tracking-wider">
          <Clock size={14} />
          <span>Recent Conversations</span>
        </div>

        <div className="mt-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare size={32} className="mx-auto text-white/20 mb-3" />
              <p className="text-sm text-white/40">No conversations yet</p>
              <p className="text-xs text-white/30 mt-1">Start a new conversation to see it here</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className="w-full flex items-start gap-3 px-3 py-3 text-left rounded-lg hover:bg-white/10 transition-colors group"
              >
                <MessageSquare size={18} className="text-white/40 mt-0.5 shrink-0 group-hover:text-white/60" />
                <span className="text-sm text-white/70 group-hover:text-white/90 line-clamp-2">
                  {getConversationPreview(conversation.message)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-[var(--accent-500)] rounded-full flex items-center justify-center text-sm font-semibold">
            AI
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">Vivace Assistant</p>
            <p className="text-xs text-white/50">Powered by DeepSeek</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
