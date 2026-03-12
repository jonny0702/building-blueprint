import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AssetImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
}

const AssetImageUploadModal = ({
  open,
  onOpenChange,
  currentImage,
  onImageSelect,
}: AssetImageUploadModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSave = () => {
    if (preview) {
      onImageSelect(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setDragOver(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar imagen del activo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview actual */}
          {currentImage && !preview && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Imagen actual</p>
              <div className="w-full h-40 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={currentImage}
                  alt="Imagen actual"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="space-y-3">
                <div className="w-full h-40 rounded-lg overflow-hidden bg-muted mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Quitar
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">
                  Arrastra una imagen o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG o WEBP (máx. 5MB)
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!preview}>
              <ImageIcon className="h-4 w-4 mr-1" />
              Guardar imagen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetImageUploadModal;
