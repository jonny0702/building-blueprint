export type OrganizationType = 'PH' | 'PROVIDER';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
}

export interface RelationConfig {
  pageTitle: string;
  pageSubtitle: string;
  searchPlaceholder: string;
  addButtonLabel: string;
  inviteModalTitle: string;
  inviteModalDescription: string;
  tableEntityLabel: string;
  emptyMessage: string;
  deleteToastMessage: string;
  confirmationMessage: string;
}

export const relationConfigByOrg: Record<OrganizationType, RelationConfig> = {
  PH: {
    pageTitle: 'Gestión de Relaciones',
    pageSubtitle: 'Gestiona tu relación con los proveedores de mantenimiento',
    searchPlaceholder: 'Buscar proveedor...',
    addButtonLabel: 'Agregar proveedor',
    inviteModalTitle: 'Invita a un proveedor',
    inviteModalDescription: 'Para invitar a un proveedor debes ingresar su correo',
    tableEntityLabel: 'Proveedor',
    emptyMessage: 'No se encontraron proveedores',
    deleteToastMessage: 'Proveedor eliminado',
    confirmationMessage: 'Tu proveedor ha recibido tu correo de enlace',
  },
  PROVIDER: {
    pageTitle: 'Gestión de Relaciones',
    pageSubtitle: 'Gestiona tu relación con las Propiedades Horizontales',
    searchPlaceholder: 'Buscar PH...',
    addButtonLabel: 'Agregar PH',
    inviteModalTitle: 'Invita a un PH',
    inviteModalDescription: 'Para invitar a un PH debes ingresar su correo',
    tableEntityLabel: 'PH',
    emptyMessage: 'No se encontraron Propiedades Horizontales',
    deleteToastMessage: 'PH eliminado',
    confirmationMessage: 'El PH ha recibido tu correo de enlace',
  },
};
