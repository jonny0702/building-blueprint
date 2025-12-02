import { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, Layers, Home, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Location } from '@/types/building';

interface LocationTreeProps {
  locations: Location[];
  onAddLocation?: (parentId: string) => void;
  onDeleteLocation?: (id: string) => void;
  onSave?: () => void;
}

export const LocationTree = ({ locations, onAddLocation, onDeleteLocation, onSave }: LocationTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(locations.map(l => l.id)));

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getIcon = (type: Location['type']) => {
    switch (type) {
      case 'building':
        return <Building2 className="h-4 w-4" />;
      case 'tower':
        return <Layers className="h-4 w-4" />;
      case 'floor':
      case 'basement':
        return <Home className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const renderLocation = (location: Location, level: number = 0) => {
    const hasChildren = location.children && location.children.length > 0;
    const isExpanded = expandedNodes.has(location.id);

    return (
      <div key={location.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center gap-2 py-2 px-3 hover:bg-accent/50 rounded-md group">
          <button
            onClick={() => toggleNode(location.id)}
            className="p-0.5 hover:bg-accent rounded"
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" />
            )}
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            {getIcon(location.type)}
            <span className="font-medium">{location.name}</span>
            <span className="text-xs text-muted-foreground">({location.type})</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex gap-1">
            {onAddLocation && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onAddLocation(location.id)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            {onDeleteLocation && location.type !== 'building' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onDeleteLocation(location.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {location.children!.map(child => renderLocation(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Estructura Generada</h3>
        {onSave && (
          <Button onClick={onSave} size="lg">
            Guardar y Continuar
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg p-4 bg-background max-h-[600px] overflow-y-auto">
        {locations.map(location => renderLocation(location))}
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Puedes agregar o eliminar ubicaciones manualmente 
          antes de guardar. Los cambios se reflejarán en el árbol en tiempo real.
        </p>
      </div>
    </Card>
  );
};
