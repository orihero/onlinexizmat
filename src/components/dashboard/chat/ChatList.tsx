import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatUserList } from './ChatUserList';

export default function ChatList() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['telegram_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telegram_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Users List */}
      <div className="w-80 border-r border-gray-100 bg-white">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        
        <ChatUserList 
          users={users || []}
          isLoading={isLoading}
          searchQuery={searchQuery}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gray-50">
        {selectedUser ? (
          <ChatMessages user={selectedUser} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}