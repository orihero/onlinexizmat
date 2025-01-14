import { formatDate } from '../../../lib/utils';
import { getStatusColor } from '../orders/StatusBadge';

interface User {
  telegram_id: number;
  phone_number: string;
  username: string;
  first_name: string;
  last_name: string;
  language: string;
  created_at: string;
  latest_order?: {
    id: string;
    status: string;
    created_at: string;
    services: {
      name_uz: string;
      name_ru: string;
    };
  };
}

interface ChatUserListProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export function ChatUserList({ users, isLoading, searchQuery, selectedUser, onSelectUser }: ChatUserListProps) {
  const filteredUsers = users
    .filter(user => {
      if (!searchQuery) return true;
      return (
        user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Sort users with active orders first
      const aHasActiveOrder = a.latest_order && ['pending', 'paid', 'inprogress'].includes(a.latest_order.status);
      const bHasActiveOrder = b.latest_order && ['pending', 'paid', 'inprogress'].includes(b.latest_order.status);
      
      if (aHasActiveOrder && !bHasActiveOrder) return -1;
      if (!aHasActiveOrder && bHasActiveOrder) return 1;
      
      // Then sort by latest order date
      if (a.latest_order && b.latest_order) {
        return new Date(b.latest_order.created_at).getTime() - new Date(a.latest_order.created_at).getTime();
      }
      
      // Finally sort by user creation date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const getUserName = (user: User) => {
    const nameParts = [];
    if (user.first_name) nameParts.push(user.first_name);
    if (user.last_name) nameParts.push(user.last_name);
    return nameParts.join(' ') || 'Anonymous';
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {filteredUsers.map((user) => {
        const hasActiveOrder = user.latest_order && ['pending', 'paid', 'inprogress'].includes(user.latest_order.status);
        
        return (
          <button
            key={user.telegram_id}
            onClick={() => onSelectUser(user)}
            className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 relative ${
              selectedUser?.telegram_id === user.telegram_id ? 'bg-orange-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-medium">
                  {user.first_name ? user.first_name[0].toUpperCase() : '#'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium flex items-center gap-2">
                  <span className="truncate">{getUserName(user)}</span>
                  {hasActiveOrder && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(user.latest_order.status)}`}>
                      {user.latest_order.status}
                    </span>
                  )}
                </div>
                {user.username && (
                  <div className="text-sm text-gray-600">@{user.username}</div>
                )}
                <div className="text-sm text-gray-500 truncate">
                  {user.phone_number || 'No phone number'}
                </div>
                {user.latest_order && (
                  <div className="text-xs text-gray-500 mt-1">
                    Latest order: {user.latest_order.services.name_uz}
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}