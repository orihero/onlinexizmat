import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Users, Image } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

interface TelegramGroup {
  id: string;
  group_id: number;
  name: string;
  photo_url: string | null;
  member_count: number;
  created_at: string;
  categories: {
    name_uz: string;
    name_ru: string;
  }[];
}

interface GroupsTableProps {
  groups: TelegramGroup[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
}

export function GroupsTable({ groups, isLoading, searchQuery, filters }: GroupsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TelegramGroup;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const handleSort = (key: keyof TelegramGroup) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleImageError = (groupId: string) => {
    setImageError(prev => ({ ...prev, [groupId]: true }));
  };

  const filteredGroups = groups
    .filter(group => {
      if (!searchQuery) return true;
      return (
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(group.group_id).includes(searchQuery)
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortConfig.key === 'member_count') {
        return sortConfig.direction === 'asc'
          ? a.member_count - b.member_count
          : b.member_count - a.member_count;
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading groups...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Group
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Group ID
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('member_count')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Members
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Categories
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('created_at')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Added Date
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
        {filteredGroups.map((group) => (
          <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                  {group.photo_url && !imageError[group.id] ? (
                    <img 
                      src={group.photo_url} 
                      alt={group.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(group.id)}
                    />
                  ) : (
                    <Image className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-gray-500">
                    {group.categories?.length 
                      ? `${group.categories.length} categories`
                      : 'No categories'
                    }
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-mono">{group.group_id}</span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {group.member_count.toLocaleString()}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="space-y-1">
                {group.categories?.map((category, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mr-2"
                  >
                    {category.name_uz}
                  </div>
                ))}
                {!group.categories?.length && (
                  <span className="text-sm text-gray-500">No categories assigned</span>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-500">
                {formatDate(group.created_at)}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}