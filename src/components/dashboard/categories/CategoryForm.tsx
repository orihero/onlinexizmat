import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Category } from '../../../types/category';
import SlideOver from '../../ui/SlideOver';
import FormSelect from '../../ui/FormSelect';
import FormInput from '../../ui/FormInput';

const categorySchema = z.object({
  name_uz: z.string().min(1, 'Name in Uzbek is required'),
  name_ru: z.string().min(1, 'Name in Russian is required'),
  group_id: z.string().nullable(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category | null;
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

  const { register, handleSubmit, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {
      name_uz: '',
      name_ru: '',
      group_id: null,
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
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

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {category ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </SlideOver>
  );
}