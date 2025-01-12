import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../../lib/supabase';
import { Order } from '../../../../../types/order';
import { Question } from '../../../../../types/question';
import { QuestionAnswer } from './QuestionAnswer';

interface OrderAnswersProps {
  order: Order;
  language?: 'uz' | 'ru';
}

export function OrderAnswers({ order, language = 'uz' }: OrderAnswersProps) {
  const { data: questions, isLoading } = useQuery({
    queryKey: ['service-questions', order.service_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('service_id', order.service_id)
        .order('order');
      
      if (error) throw error;
      return data as Question[];
    }
  });

  if (!order.answers?.length || isLoading || !questions) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">Customer Answers</h3>
      <div className="space-y-4">
        {order.answers.map((answer) => {
          const question = questions.find(q => q.order === answer.question_index);
          if (!question) return null;
          
          return (
            <QuestionAnswer
              key={answer.question_index}
              answer={answer}
              question={question}
              language={language}
            />
          );
        })}
      </div>
    </div>
  );
}

export default OrderAnswers;