import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatUserList } from './ChatUserList';
import { ChatHeader } from './ChatHeader';

export default function ChatList() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['telegram_users_with_orders'],
    queryFn: async () => {
      // First get all users
      const { data: users, error: usersError } = await supabase
        .from('telegram_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;

      // Then get their latest orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          telegram_user_id,
          status,
          created_at,
          services (
            name_uz,
            name_ru
          )
        `)
        .in('status', ['pending', 'paid', 'inprogress', 'delivered'])
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Map orders to users
      const usersWithOrders = users.map(user => ({
        ...user,
        latest_order: orders.find(order => order.telegram_user_id === user.telegram_id)
      }));
      
      return usersWithOrders;
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
          <div className="flex flex-col h-full">
            <ChatHeader user={selectedUser} />
            <div className="flex-1 overflow-y-auto">
              <ChatMessages user={selectedUser} />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}