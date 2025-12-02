import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BuildingConfig } from '@/types/building';

interface FloorsConfigStepProps {
  onNext: (data: Partial<BuildingConfig>) => void;
  onBack: () => void;
  initialData?: Partial<BuildingConfig>;
}

export const FloorsConfigStep = ({ onNext, onBack, initialData }: FloorsConfigStepProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      floorStart: 1,
      floorEnd: 20,
      basementCount: 0,
      commonAreas: {
        electricRoom: true,
        trashRoom: true,
        waterRoom: false,
        emergencyExit: false,
      }
    }
  });

  const commonAreas = watch('commonAreas') || {
    electricRoom: false,
    trashRoom: false,
    waterRoom: false,
    emergencyExit: false,
  };

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floorStart">Piso Inicial *</Label>
          <Input
            id="floorStart"
            type="number"
            {...register('floorStart', { 
              required: 'Requerido',
              min: { value: 1, message: 'Mínimo 1' }
            })}
          />
          {errors.floorStart && (
            <p className="text-sm text-destructive">{errors.floorStart.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="floorEnd">Piso Final *</Label>
          <Input
            id="floorEnd"
            type="number"
            {...register('floorEnd', { 
              required: 'Requerido',
              min: { value: 1, message: 'Mínimo 1' }
            })}
          />
          {errors.floorEnd && (
            <p className="text-sm text-destructive">{errors.floorEnd.message as string}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="basementCount">Cantidad de Sótanos</Label>
        <Input
          id="basementCount"
          type="number"
          min="0"
          {...register('basementCount')}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Áreas Comunes por Piso</Label>
        <p className="text-sm text-muted-foreground">
          Estas áreas se crearán automáticamente en cada piso
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="electricRoom"
              checked={commonAreas.electricRoom}
              onCheckedChange={(checked) => 
                setValue('commonAreas.electricRoom', checked as boolean)
              }
            />
            <Label htmlFor="electricRoom" className="font-normal cursor-pointer">
              Cuarto Eléctrico
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="trashRoom"
              checked={commonAreas.trashRoom}
              onCheckedChange={(checked) => 
                setValue('commonAreas.trashRoom', checked as boolean)
              }
            />
            <Label htmlFor="trashRoom" className="font-normal cursor-pointer">
              Cuarto de Basura
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="waterRoom"
              checked={commonAreas.waterRoom}
              onCheckedChange={(checked) => 
                setValue('commonAreas.waterRoom', checked as boolean)
              }
            />
            <Label htmlFor="waterRoom" className="font-normal cursor-pointer">
              Cuarto de Agua/Bombas
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="emergencyExit"
              checked={commonAreas.emergencyExit}
              onCheckedChange={(checked) => 
                setValue('commonAreas.emergencyExit', checked as boolean)
              }
            />
            <Label htmlFor="emergencyExit" className="font-normal cursor-pointer">
              Salida de Emergencia
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit" size="lg">
          Siguiente
        </Button>
      </div>
    </form>
  );
};
