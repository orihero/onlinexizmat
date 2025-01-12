import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Overview from '../components/dashboard/Overview';
import CategoriesList from '../components/dashboard/categories/CategoriesList';
import ServicesList from '../components/dashboard/services/ServicesList';
import QuestionsList from '../components/dashboard/questions/QuestionsList';
import OrdersList from '../components/dashboard/orders/OrdersList';

type TabType = 'overview' | 'categories' | 'services' | 'questions' | 'orders';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { signOut } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'categories':
        return <CategoriesList />;
      case 'services':
        return <ServicesList />;
      case 'questions':
        return <QuestionsList />;
      case 'orders':
        return <OrdersList />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignOut={signOut} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}