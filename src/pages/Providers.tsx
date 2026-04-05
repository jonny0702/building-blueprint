import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { mockProviders } from '@/data/mockProviders';
import { Provider, providerStatusLabels, providerStatusColors } from '@/types/provider';
import { ProviderInviteModal } from '@/components/providers/ProviderInviteModal';
import { ProviderSentConfirmation } from '@/components/providers/ProviderSentConfirmation';
import { useOrganization } from '@/hooks/useOrganization';
import { useToast } from '@/hooks/use-toast';

const Providers = () => {
  const { toast } = useToast();
  const { organization, relationConfig } = useOrganization();
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchSearch =
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.contactEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [providers, search, statusFilter]);

  const handleInvite = (email: string) => {
    setInviteOpen(false);
    setShowConfirmation(true);
  };

  const handleDelete = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
    toast({ title: relationConfig.deleteToastMessage });
  };

  if (showConfirmation) {
    return (
      <ProviderSentConfirmation
        onBack={() => setShowConfirmation(false)}
        message={relationConfig.confirmationMessage}
      />
    );
  }

  return (
    <MainLayout title="Relaciones" organizationName={organization.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{relationConfig.pageTitle}</h1>
          <p className="text-muted-foreground mt-1">{relationConfig.pageSubtitle}</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={relationConfig.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => setInviteOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {relationConfig.addButtonLabel}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{relationConfig.tableEntityLabel}</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={providerStatusColors[p.status]}>
                        {providerStatusLabels[p.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.contactEmail}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {relationConfig.emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ProviderInviteModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
        title={relationConfig.inviteModalTitle}
        description={relationConfig.inviteModalDescription}
      />
    </MainLayout>
  );
};

export default Providers;
