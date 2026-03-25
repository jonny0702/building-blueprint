import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AssetHistoryEntry } from '@/types/assetHistory';
import { assetStatusLabels, assetStatusColors } from '@/types/asset';

interface AssetHistoryTableProps {
  history: AssetHistoryEntry[];
}

const AssetHistoryTable = ({ history }: AssetHistoryTableProps) => {
  if (history.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        No hay registros de historial para este activo.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Codigo de Activo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha de cambio</TableHead>
          <TableHead>Campo</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Usuario</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.assetCode}</TableCell>
            <TableCell>
              <Badge className={assetStatusColors[entry.status]}>
                {assetStatusLabels[entry.status]}
              </Badge>
            </TableCell>
            <TableCell>{entry.changeDate}</TableCell>
            <TableCell className="text-muted-foreground">{entry.field || ''}</TableCell>
            <TableCell className="max-w-[200px] text-muted-foreground">{entry.description || ''}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {entry.userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssetHistoryTable;
