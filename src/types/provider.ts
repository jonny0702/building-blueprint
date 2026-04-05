export type ProviderStatus = 'active' | 'inactive' | 'pending';

export interface Provider {
  id: string;
  code: string;
  name: string;
  contactEmail: string;
  status: ProviderStatus;
}

export const providerStatusLabels: Record<ProviderStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  pending: 'Pendiente',
};

export const providerStatusColors: Record<ProviderStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};
