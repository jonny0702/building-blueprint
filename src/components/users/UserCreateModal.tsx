import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole, roleLabels } from '@/types/user';

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; email: string; role: UserRole }) => void;
  allowedRoles: UserRole[];
}

const UserCreateModal = ({ open, onClose, onSubmit, allowedRoles }: UserCreateModalProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !role) return;
    onSubmit({ firstName, lastName, email, role: role as UserRole });
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo usuario</DialogTitle>
          <DialogDescription>Completa los datos del nuevo usuario para enviarle una invitación.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
            <p className="text-xs text-muted-foreground">
              Se enviará un correo con una contraseña temporal. El usuario deberá cambiarla al iniciar sesión por primera vez.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((r) => (
                  <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!firstName || !lastName || !email || !role}>Crear usuario</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModal;
