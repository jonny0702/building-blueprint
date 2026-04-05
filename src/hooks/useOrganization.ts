import { useMemo } from 'react';
import { Organization, OrganizationType, relationConfigByOrg } from '@/types/organization';
import { currentUser } from '@/data/mockUsers';

// Derives organization type from the current user's role
const getOrgType = (): OrganizationType => {
  if (currentUser.role === 'PROVIDER_ADMIN' || currentUser.role === 'PROVIDER_TECH') {
    return 'PROVIDER';
  }
  return 'PH';
};

// Mock current organization
const mockOrganization: Organization = {
  id: 'org-001',
  name: 'PH. Brisas de Miraflores',
  type: getOrgType(),
};

export const useOrganization = () => {
  const organization = mockOrganization;

  const relationConfig = useMemo(
    () => relationConfigByOrg[organization.type],
    [organization.type]
  );

  return { organization, relationConfig };
};
