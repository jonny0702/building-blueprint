import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BuildingConfig } from '@/types/building';

interface BuildingInfoStepProps {
  onNext: (data: Partial<BuildingConfig>) => void;
  initialData?: Partial<BuildingConfig>;
}

export const BuildingInfoStep = ({ onNext, initialData }: BuildingInfoStepProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {}
  });

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del PH *</Label>
        <Input
          id="name"
          placeholder="Ej: PH Vista Mar"
          {...register('name', { required: 'Este campo es requerido' })}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ruc">RUC</Label>
        <Input
          id="ruc"
          placeholder="2-3425-235-DF"
          {...register('ruc')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="towerCount">Cantidad de Torres *</Label>
          <Input
            id="towerCount"
            type="number"
            min="1"
            placeholder="2"
            {...register('towerCount', { 
              required: 'Requerido',
              min: { value: 1, message: 'Mínimo 1' }
            })}
          />
          {errors.towerCount && (
            <p className="text-sm text-destructive">{errors.towerCount.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="towerPrefix">Prefijo de Torres *</Label>
          <Input
            id="towerPrefix"
            placeholder="Torre"
            {...register('towerPrefix', { required: 'Requerido' })}
          />
          {errors.towerPrefix && (
            <p className="text-sm text-destructive">{errors.towerPrefix.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Siguiente
        </Button>
      </div>
    </form>
  );
};
