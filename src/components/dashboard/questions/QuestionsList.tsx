import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import QuestionForm from './QuestionForm';
import { Question } from '../../../types/question';

export default function QuestionsList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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
      return data as Question[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Question
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions?.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {question.order}
                </td>
                <td className="px-6 py-4">
                  <div>{question.question_uz}</div>
                  <div className="text-sm text-gray-500">{question.question_ru}</div>
                </td>
                <td className="px-6 py-4">
                  {question.services && (
                    <>
                      <div>{question.services.name_uz}</div>
                      <div className="text-sm text-gray-500">{question.services.name_ru}</div>
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setEditingQuestion(question)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await supabase
                        .from('questions')
                        .delete()
                        .eq('id', question.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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