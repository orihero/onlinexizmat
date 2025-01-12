import { useAuth } from '../../contexts/AuthContext';
import { Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

export default function Header({ onSignOut }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-4 pr-10 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-gray-500 hover:text-gray-600">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700">{user?.email}</span>
            <button onClick={onSignOut} className="text-gray-500 hover:text-gray-600">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}