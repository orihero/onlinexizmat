import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, Plus } from 'lucide-react';
import QuestionForm from './QuestionForm';
import {QuestionsTable}  from './QuestionsTable';
import {QuestionFilters}  from './QuestionFilters';

export default function QuestionsList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          services (
            name_uz,
            name_ru
          )
        `)
        .order('order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Questions</h1>
          <p className="text-gray-500">Manage your service questions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64"
            />
          </div>
          
          <button className="p-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      <QuestionFilters filters={filters} onFilterChange={setFilters} />

      <div className="bg-white rounded-xl border border-gray-100 mt-6">
        <QuestionsTable 
          questions={questions || []} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          filters={filters}
          onEdit={setEditingQuestion}
        />
      </div>

      {(isFormOpen || editingQuestion) && (
        <QuestionForm
          question={editingQuestion}
          onClose={() => {
            setIsFormOpen(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}