import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

interface Client {
  telegram_id: number;
  phone_number: string;
  username: string;
  first_name: string;
  last_name: string;
  language: string;
  created_at: string;
}

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
}

export function ClientsTable({ clients, isLoading, searchQuery, filters }: ClientsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Client;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const handleSort = (key: keyof Client) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getClientName = (client: Client) => {
    const nameParts = [];
    if (client.first_name) nameParts.push(client.first_name);
    if (client.last_name) nameParts.push(client.last_name);
    const fullName = nameParts.join(' ');
    return fullName || 'Anonymous';
  };

  const filteredClients = clients
    .filter(client => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        client.phone_number?.toLowerCase().includes(searchLower) ||
        client.username?.toLowerCase().includes(searchLower) ||
        client.first_name?.toLowerCase().includes(searchLower) ||
        client.last_name?.toLowerCase().includes(searchLower) ||
        String(client.telegram_id).includes(searchQuery)
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
        Loading clients...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Client
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Phone Number
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Language
            </span>
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
        {filteredClients.map((client) => (
          <tr key={client.telegram_id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-medium">
                    {client.first_name ? client.first_name[0].toUpperCase() : '#'}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{getClientName(client)}</div>
                  {client.username && (
                    <div className="text-sm text-gray-600">@{client.username}</div>
                  )}
                  <div className="text-sm text-gray-500">ID: {client.telegram_id}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm">{client.phone_number || 'Not provided'}</span>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                client.language === 'uz' 
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {client.language === 'uz' ? '🇺🇿 Uzbek' : '🇷🇺 Russian'}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-500">
                {formatDate(client.created_at)}
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