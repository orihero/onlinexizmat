import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onSignOut: () => Promise<void>;
}

export default function Header({ onSignOut }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex justify-end items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff"
              alt="User"
              className="w-8 h-8 rounded-lg"
            />
            <div className="text-sm">
              <div className="font-medium">{user?.email?.split('@')[0]}</div>
              <div className="text-gray-500 text-xs">Free Plan</div>
            </div>
            <button onClick={onSignOut}>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}