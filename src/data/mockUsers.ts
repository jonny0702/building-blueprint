import { AppUser, UserRole } from '@/types/user';

export const currentUser: AppUser = {
  id: 'current-user',
  firstName: 'Gabriel',
  lastName: 'Martinez',
  email: 'gabriel@empresa.com',
  role: 'PH_ADMIN',
  status: 'active',
  createdAt: '2024-01-15',
};

export const mockUsers: AppUser[] = [
  currentUser,
  {
    id: 'user-002',
    firstName: 'Laura',
    lastName: 'Sánchez',
    email: 'laura.sanchez@empresa.com',
    role: 'PH_ASSISTANT',
    status: 'pending',
    createdAt: '2025-03-20',
  },
];

export const PLAN_LIMITS: Record<string, number> = {
  basic: 2,
  pro: 10,
  enterprise: 50,
};

export const currentPlan = 'basic';

export const getAllowedRoles = (adminRole: UserRole): UserRole[] => {
  if (adminRole === 'PH_ADMIN') return ['PH_ASSISTANT'];
  if (adminRole === 'PROVIDER_ADMIN') return ['PROVIDER_TECH'];
  return [];
};
