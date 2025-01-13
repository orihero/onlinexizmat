import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import SlideOver from '../../ui/SlideOver';
import FormInput from '../../ui/FormInput';
import FormSelect from '../../ui/FormSelect';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';

const categorySchema = z.object({
  name_uz: z.string().min(1, 'Name in Uzbek is required'),
  name_ru: z.string().min(1, 'Name in Russian is required'),
  group_id: z.string().nullable(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: any;
  onClose: () => void;
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const queryClient = useQueryClient();

  const { data: groups } = useQuery({
    queryKey: ['telegram_groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telegram_groups')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {
      name_uz: '',
      name_ru: '',
      group_id: null,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        await supabase
          .from('categories')
          .update(data)
          .eq('id', category.id);
      } else {
        await supabase
          .from('categories')
          .insert([data]);
      }
      
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <SlideOver
      title={category ? 'Edit Category' : 'Add Category'}
      isOpen={true}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Name (Uzbek)"
          error={errors.name_uz?.message}
          {...register('name_uz')}
        />

        <FormInput
          label="Name (Russian)"
          error={errors.name_ru?.message}
          {...register('name_ru')}
        />

        <FormSelect
          label="Telegram Group"
          {...register('group_id')}
        >
          <option value="">Select a group</option>
          {groups?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} ({group.member_count} members)
            </option>
          ))}
        </FormSelect>

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
            {category ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </form>
    </SlideOver>
  );
}