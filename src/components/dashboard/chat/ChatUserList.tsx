import { formatDate } from '../../../lib/utils';

interface User {
  telegram_id: number;
  phone_number: string;
  username: string;
  first_name: string;
  last_name: string;
  language: string;
  created_at: string;
}

interface ChatUserListProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export function ChatUserList({ users, isLoading, searchQuery, selectedUser, onSelectUser }: ChatUserListProps) {
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    return (
      user.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
      {filteredUsers.map((user) => (
        <button
          key={user.telegram_id}
          onClick={() => onSelectUser(user)}
          className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
            selectedUser?.telegram_id === user.telegram_id ? 'bg-orange-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-medium">
                {user.first_name ? user.first_name[0].toUpperCase() : '#'}
              </span>
            </div>
            <div>
              <div className="font-medium">{getUserName(user)}</div>
              {user.username && (
                <div className="text-sm text-gray-600">@{user.username}</div>
              )}
              <div className="text-sm text-gray-500">
                {user.phone_number || 'No phone number'}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}