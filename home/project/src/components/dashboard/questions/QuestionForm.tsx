import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Question, QuestionType } from '../../../types/question';
import SlideOver from '../../ui/SlideOver';
import FormInput from '../../ui/FormInput';
import FormTextarea from '../../ui/FormTextarea';
import QuestionTypeSelect from './form/QuestionTypeSelect';
import ServiceSelect from './form/ServiceSelect';
import FileTypeSelect, { FileType, getExtensionsForFileTypes } from './form/FileTypeSelect';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';

const questionSchema = z.object({
  service_id: z.string().min(1, 'Service is required'),
  question_uz: z.string().min(1, 'Question in Uzbek is required'),
  question_ru: z.string().min(1, 'Question in Russian is required'),
  type: z.enum(['yes_no', 'text', 'file', 'picture']),
  price: z.number().min(0, 'Price must be positive'),
  order: z.number().min(0, 'Order must be positive'),
  file_types: z.array(z.enum(['document', 'photo', 'audio', 'video'])).optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: Question | null;
  onClose: () => void;
}

export default function QuestionForm({ question, onClose }: QuestionFormProps) {
  const queryClient = useQueryClient();

  const defaultValues: QuestionFormData = question ? {
    service_id: question.service_id,
    question_uz: question.question_uz,
    question_ru: question.question_ru,
    type: question.type,
    price: question.price,
    order: question.order || 0,
    file_types: [],
  } : {
    service_id: '',
    question_uz: '',
    question_ru: '',
    type: 'text',
    price: 0,
    order: 0,
    file_types: [],
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const questionType = watch('type');

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const submitData = {
        ...data,
        file_extensions: data.type === 'file' && data.file_types?.length 
          ? getExtensionsForFileTypes(data.file_types)
          : null,
      };

      if (question) {
        await supabase
          .from('questions')
          .update(submitData)
          .eq('id', question.id);
      } else {
        await supabase
          .from('questions')
          .insert([submitData]);
      }
      
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      onClose();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  return (
    <SlideOver
      title={question ? 'Edit Question' : 'Add Question'}
      isOpen={true}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ServiceSelect
          value={watch('service_id')}
          onChange={(value) => setValue('service_id', value)}
          error={errors.service_id?.message}
        />

        <QuestionTypeSelect
          value={watch('type')}
          onChange={(value) => setValue('type', value as QuestionType)}
          error={errors.type?.message}
        />

        <FormInput
          type="number"
          label="Order"
          error={errors.order?.message}
          {...register('order', { valueAsNumber: true })}
        />

        <FormInput
          type="number"
          label="Additional Price"
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />

        <FormTextarea
          label="Question (Uzbek)"
          error={errors.question_uz?.message}
          rows={4}
          {...register('question_uz')}
        />

        <FormTextarea
          label="Question (Russian)"
          error={errors.question_ru?.message}
          rows={4}
          {...register('question_ru')}
        />

        {questionType === 'file' && (
          <FileTypeSelect
            value={watch('file_types') || []}
            onChange={(types) => setValue('file_types', types)}
            error={errors.file_types?.message}
          />
        )}

        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {question ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </form>
    </SlideOver>
  );
}