import { Image as ImageIcon } from 'lucide-react';
import FileUploadModal, { type FileUploadModalConfig } from '@/components/ui/FileUploadModal';

interface AssetImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
}

const imageConfig: FileUploadModalConfig = {
  title: 'Cambiar imagen del activo',
  acceptLabel: 'Arrastra una imagen o haz clic para seleccionar',
  acceptDescription: 'PNG, JPG o WEBP (máx. 5MB)',
  accept: 'image/*',
  saveLabel: 'Guardar imagen',
  previewAsImage: true,
  currentPreviewLabel: 'Imagen actual',
};

const AssetImageUploadModal = ({
  open,
  onOpenChange,
  currentImage,
  onImageSelect,
}: AssetImageUploadModalProps) => {
  return (
    <FileUploadModal
      open={open}
      onOpenChange={onOpenChange}
      config={{
        ...imageConfig,
        currentPreview: currentImage,
        saveIcon: <ImageIcon className="h-4 w-4 mr-1" />,
      }}
      onFileSelect={(_file, objectUrl) => onImageSelect(objectUrl)}
    />
  );
};

export default AssetImageUploadModal;
