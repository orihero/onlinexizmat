import { FilePreview } from './FilePreview';
import { OrderAnswer } from '../../../../../types/order';
import { Question } from '../../../../../types/question';

interface QuestionAnswerProps {
  answer: OrderAnswer;
  question: Question;
  language?: 'uz' | 'ru';
}

export function QuestionAnswer({ answer, question, language = 'uz' }: QuestionAnswerProps) {
  const isFile = answer.file_type;
  const questionText = question[`question_${language}`];

  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <div className="text-sm font-medium text-gray-900 mb-2">
        {questionText}
      </div>
      {isFile ? (
        <FilePreview answer={answer} />
      ) : (
        <div className="text-sm text-gray-700 bg-gray-50 rounded-md p-3">
          {answer.answer}
        </div>
      )}
    </div>
  );
}