export type UserRole = 'PH_ADMIN' | 'PH_ASSISTANT' | 'PROVIDER_ADMIN' | 'PROVIDER_TECH';

export type UserStatus = 'active' | 'pending';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export const roleLabels: Record<UserRole, string> = {
  PH_ADMIN: 'PH Admin',
  PH_ASSISTANT: 'PH Assistant',
  PROVIDER_ADMIN: 'Provider Admin',
  PROVIDER_TECH: 'Provider Tech',
};

export const roleColors: Record<UserRole, string> = {
  PH_ADMIN: 'bg-blue-100 text-blue-800',
  PH_ASSISTANT: 'bg-sky-100 text-sky-800',
  PROVIDER_ADMIN: 'bg-amber-100 text-amber-800',
  PROVIDER_TECH: 'bg-emerald-100 text-emerald-800',
};

export const statusLabels: Record<UserStatus, string> = {
  active: 'Activo',
  pending: 'Pendiente',
};

export const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
};
