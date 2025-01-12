import { Home, Package, List, MessageSquare, ShoppingCart } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: 'overview' | 'categories' | 'services' | 'questions' | 'orders') => void;
}

const tabs = [
  { id: 'overview', label: 'Dashboard', icon: Home },
  { id: 'categories', label: 'Categories', icon: Package },
  { id: 'services', label: 'Services', icon: List },
  { id: 'questions', label: 'Questions', icon: MessageSquare },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">DashStack</h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => onTabChange(tab.id as any)}
                  className={`w-full flex items-center px-6 py-3 text-sm ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}