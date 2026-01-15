import React from 'react';

interface SidebarProps {
  conversations: { id: string; message: string }[];
  onSelectConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, onSelectConversation }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-cyan-800 to-cyan-900 text-white p-4 h-full overflow-y-auto border-r border-cyan-700">
      <h2 className="text-xl font-bold mb-4">Conversation History</h2>
      <ul>
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            className="p-3 border-b border-cyan-700 cursor-pointer hover:bg-cyan-700 rounded-lg mb-2 transition-all duration-200"
            onClick={() => onSelectConversation(conversation.id)}
          >
            {conversation.message.substring(0, 30)}...
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
