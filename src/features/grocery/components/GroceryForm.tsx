import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  amount: yup
    .number()
    .typeError('Amount should be a number')
    .required('Amount is required')
    .positive('Amount must be positive'),
});

export type GroceryFormValues = {
  name: string;
  amount: number;
};

interface GroceryFormProps {
  defaultValues?: GroceryFormValues;
  onSubmit: (data: GroceryFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  isCompact?: boolean;
}

export function GroceryForm({
  defaultValues = { name: '', amount: '' as unknown as number },
  onSubmit,
  isLoading = false,
  submitLabel = 'Submit',
  loadingLabel = 'Submitting...',
  isCompact = false,
}: GroceryFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<GroceryFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleSubmitPress = (data: GroceryFormValues) => {
    onSubmit(data);
    reset();
  };

  if (isCompact) {
    return (
      <form
        onSubmit={handleSubmit(handleSubmitPress)}
        className="gap-2 flex sm:non-flex flex-col sm:flex-row"
      >
        <div className="flex flex-row flex-1 gap-2">
          <div className="flex flex-col flex-1">
            <Input
              {...register('name')}
              autoFocus
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Item"
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col w-20">
            <Input
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'border-red-500' : ''}
              placeholder="Amount"
              type="string"
              disabled={isLoading}
            />
            {errors.amount && (
              <span className="text-xs text-red-500">
                {errors.amount.message}
              </span>
            )}
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitPress)}
      className="grid gap-4 py-4"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <div className="col-span-3">
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <div className="col-span-3">
            <Input
              id="amount"
              type="number"
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.amount && (
              <span className="text-xs text-red-500">
                {errors.amount.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? loadingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
