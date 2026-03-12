import { useState, useRef } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface FileUploadModalConfig {
  title: string;
  acceptLabel: string;
  acceptDescription: string;
  accept: string;
  saveLabel: string;
  saveIcon?: React.ReactNode;
  currentPreview?: string;
  currentPreviewLabel?: string;
  /** If true, shows image preview. If false, shows file name/icon. */
  previewAsImage?: boolean;
}

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: FileUploadModalConfig;
  onFileSelect: (file: File, objectUrl: string) => void;
}

const FileUploadModal = ({
  open,
  onOpenChange,
  config,
  onFileSelect,
}: FileUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
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
    if (selectedFile && preview) {
      onFileSelect(selectedFile, preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setDragOver(false);
    onOpenChange(false);
  };

  const renderPreview = () => {
    if (!preview || !selectedFile) return null;

    if (config.previewAsImage) {
      return (
        <div className="space-y-3">
          <div className="w-full h-40 rounded-lg overflow-hidden bg-muted mx-auto">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              setSelectedFile(null);
              setPreview(null);
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Quitar
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <FileIcon className="h-8 w-8 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            setSelectedFile(null);
            setPreview(null);
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Quitar
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current preview */}
          {config.currentPreview && !preview && config.previewAsImage && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{config.currentPreviewLabel ?? 'Archivo actual'}</p>
              <div className="w-full h-40 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img src={config.currentPreview} alt="Actual" className="w-full h-full object-cover" />
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
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? renderPreview() : (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">{config.acceptLabel}</p>
                <p className="text-xs text-muted-foreground">{config.acceptDescription}</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!preview}>
              {config.saveIcon}
              {config.saveLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
