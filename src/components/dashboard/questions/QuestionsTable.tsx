import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Trash2, Edit2 } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Question } from '../../../types/question';

interface QuestionsTableProps {
  questions: Question[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    status: string;
    date: string;
  };
  onEdit: (question: Question) => void;
}

export function QuestionsTable({ questions, isLoading, searchQuery, filters, onEdit }: QuestionsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Question;
    direction: 'asc' | 'desc';
  }>({ key: 'order', direction: 'asc' });

  const queryClient = useQueryClient();

  const handleSort = (key: keyof Question) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    queryClient.invalidateQueries({ queryKey: ['questions'] });
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'file':
        return 'bg-blue-50 text-blue-700';
      case 'yes_no':
        return 'bg-green-50 text-green-700';
      case 'picture':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const filteredQuestions = questions
    .filter(question => {
      if (!searchQuery) return true;
      return (
        question.question_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.question_ru.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === 'order') {
        return sortConfig.direction === 'asc'
          ? a.order - b.order
          : b.order - a.order;
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading questions...
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-6 py-4 text-left">
            <button
              onClick={() => handleSort('order')}
              className="text-xs font-medium text-gray-500 uppercase flex items-center gap-2"
            >
              Order
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Question
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Service
            </span>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Type
            </span>
          </th>
          <th className="px-6 py-4 text-right">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Actions
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredQuestions.map((question) => (
          <tr key={question.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4">
              <span className="text-sm font-medium">#{question.order}</span>
            </td>
            <td className="px-6 py-4">
              <div className="font-medium">{question.question_uz}</div>
              <div className="text-sm text-gray-500">{question.question_ru}</div>
            </td>
            <td className="px-6 py-4">
              <div className="font-medium">{question.services?.name_uz}</div>
              <div className="text-sm text-gray-500">{question.services?.name_ru}</div>
            </td>
            <td className="px-6 py-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyles(question.type)}`}>
                {question.type}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => onEdit(question)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDelete(question.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}