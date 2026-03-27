import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { AppUser, UserRole, roleLabels, roleColors, statusLabels, statusColors } from '@/types/user';
import { mockUsers, currentUser, PLAN_LIMITS, currentPlan, getAllowedRoles } from '@/data/mockUsers';
import UserCreateModal from '@/components/users/UserCreateModal';
import { toast } from '@/components/ui/sonner';

const UsersPage = () => {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [createOpen, setCreateOpen] = useState(false);

  const limit = PLAN_LIMITS[currentPlan];
  const used = users.length;
  const isFull = used >= limit;
  const allowedRoles = getAllowedRoles(currentUser.role);

  const handleCreate = (data: { firstName: string; lastName: string; email: string; role: UserRole }) => {
    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    toast('Usuario creado exitosamente');
  };

  const handleDelete = (id: string) => {
    if (id === currentUser.id) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast('Usuario eliminado');
  };

  return (
    <MainLayout title="Usuarios" organizationName="Mi Organización">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuarios y Permisos</h1>
            <p className="text-sm text-muted-foreground mt-1">Administra los usuarios de tu organización y sus roles de acceso.</p>
          </div>

          {/* Quota + Create */}
          <div className="flex items-center gap-4">
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="flex items-center gap-3 p-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Asientos usados</p>
                  <div className="flex items-center gap-2">
                    <Progress value={(used / limit) * 100} className="h-2 w-24" />
                    <span className="text-xs font-semibold">{used} de {limit}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Plan Básico</Badge>
              </CardContent>
            </Card>

            {isFull ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button disabled className="gap-2">
                      <Plus className="h-4 w-4" /> Crear Usuario
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Límite de plan alcanzado. Sube a Pro para crear más usuarios.</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button className="gap-2" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> Crear Usuario
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]} variant="secondary">
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]} variant="secondary">
                        {statusLabels[user.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={user.id === currentUser.id}
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <UserCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        allowedRoles={allowedRoles}
      />
    </MainLayout>
  );
};

export default UsersPage;
