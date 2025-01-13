import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

interface Customer {
  telegram_id: number;
  phone_number: string;
  language: string;
  created_at: string;
}

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
}

export function CustomersTable({ customers, isLoading, searchQuery, filters }: CustomersTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const handleSort = (key: keyof Customer) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredCustomers = customers
    .filter(customer => {
      if (!searchQuery) return true;
      return (
        customer.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(customer.telegram_id).includes(searchQuery)
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading customers...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('telegram_id')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Customer ID
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('phone_number')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Phone Number
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('language')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Language
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('created_at')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Join Date
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-right">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Actions
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredCustomers.map((customer) => (
          <tr key={customer.telegram_id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <span className="text-sm font-medium">#{customer.telegram_id}</span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm">{customer.phone_number || 'Not provided'}</span>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                customer.language === 'uz' 
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {customer.language === 'uz' ? '🇺🇿 Uzbek' : '🇷🇺 Russian'}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-500">
                {formatDate(customer.created_at)}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}