import { Link, useLocation } from 'react-router-dom';
import { Home, FolderTree, Wrench, MessageSquare, ShoppingCart, Users, Mail, BarChart2, Link as LinkIcon, Settings, HelpCircle, MessagesSquare, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const mainMenuItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: Home },
  { id: 'chat', path: '/chat', label: 'Chat', icon: MessageCircle },
  { id: 'categories', path: '/categories', label: 'Categories', icon: FolderTree },
  { id: 'services', path: '/services', label: 'Services', icon: Wrench },
  { id: 'questions', path: '/questions', label: 'Questions', icon: MessageSquare },
  { id: 'orders', path: '/orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', path: '/customers', label: 'Customers', icon: Users },
  { id: 'groups', path: '/groups', label: 'Telegram Groups', icon: MessagesSquare },
];

const otherItems = [
  { id: 'email', path: '/email', label: 'Email', icon: Mail },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'integration', path: '/integration', label: 'Integration', icon: LinkIcon },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item: any) => (
    <Link
      key={item.id}
      to={item.path}
      className={cn(
        "w-full flex items-center px-4 py-2 text-sm rounded-lg",
        isActive(item.path)
          ? "bg-orange-50 text-orange-600"
          : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-100 p-4">
      <div className="flex items-center gap-2 px-4 mb-8">
        <div className="w-8 h-8 bg-black rounded-lg"></div>
        <div className="font-semibold">Veselty Inc.</div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase">Main menu</div>
          <nav className="space-y-1">
            {mainMenuItems.map(renderNavItem)}
          </nav>
        </div>

        <div>
          <div className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase">Other</div>
          <nav className="space-y-1">
            {otherItems.map(renderNavItem)}
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <nav className="space-y-1">
          <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
          <button className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <HelpCircle className="w-5 h-5 mr-3" />
            Help Center
          </button>
        </nav>
      </div>
    </aside>
  );
}