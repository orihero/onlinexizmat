import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/supabase';
import { Order } from '../../../../types/order';

interface OrderAnswersProps {
  order: Order;
  language?: 'uz' | 'ru';
}

export default function OrderAnswers({ order, language = 'uz' }: OrderAnswersProps) {
  const { data: questions } = useQuery({
    queryKey: ['service-questions', order.service_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('service_id', order.service_id)
        .order('order');
      
      if (error) throw error;
      return data;
    },
  });

  if (!order.answers?.length) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Customer Answers</h3>
      <div className="space-y-4">
        {order.answers.map((answer, index) => {
          const question = questions?.find(q => q.order === answer.question_index);
          
          return (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="text-sm font-medium text-gray-500">
                {question ? question[`question_${language}`] : `Question ${answer.question_index + 1}`}
              </div>
              <div className="mt-1 text-sm text-gray-900">
                {answer.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}