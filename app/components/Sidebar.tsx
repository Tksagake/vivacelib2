import React from 'react';

interface SidebarProps {
  conversations: { id: string; message: string }[];
  onSelectConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, onSelectConversation }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Conversation History</h2>
      <ul>
        {conversations.map((conversation) => (
          <li
            key={conversation.id}
            className="p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
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
