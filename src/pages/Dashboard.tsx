import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Overview from '../components/dashboard/Overview';
import CategoriesList from '../components/dashboard/categories/CategoriesList';
import ServicesList from '../components/dashboard/services/ServicesList';
import QuestionsList from '../components/dashboard/questions/QuestionsList';
import OrdersList from '../components/dashboard/orders/OrdersList';
import OrderDetails from './OrderDetails';
import CustomersList from '../components/dashboard/customers/CustomersList';
import GroupsList from '../components/dashboard/groups/GroupsList';
import ChatList from '../components/dashboard/chat/ChatList';

export default function Dashboard() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onSignOut={signOut} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/questions" element={<QuestionsList />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/customers" element={<CustomersList />} />
            <Route path="/groups" element={<GroupsList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}