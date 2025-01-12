import { QuestionType } from '../../../../types/question';
import FormSelect from '../../../ui/FormSelect';

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'yes_no', label: 'Yes/No Question' },
  { value: 'text', label: 'Text Answer' },
  { value: 'file', label: 'File Upload' },
  { value: 'picture', label: 'Picture Upload' },
];

interface QuestionTypeSelectProps {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
  error?: string;
}

export default function QuestionTypeSelect({ value, onChange, error }: QuestionTypeSelectProps) {
  return (
    <FormSelect
      label="Question Type"
      value={value}
      onChange={(e) => onChange(e.target.value as QuestionType)}
      error={error}
    >
      {questionTypes.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </FormSelect>
  );
}