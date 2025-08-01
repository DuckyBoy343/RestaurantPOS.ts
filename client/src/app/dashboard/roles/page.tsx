import RolesClient from './RolesClient';
import { fetchRoles } from '@/services/roles';
import { Role } from '@/types/role';

export default async function ManageRolesPage() {
  const roles: Role[] = await fetchRoles();

  const formattedRoles = roles.map(role => ({
    id: role.id_rol, // Map the 'id_rol' property to 'id'
    ...role,         // Keep all other properties the same
  }));

  return <RolesClient initialItems={formattedRoles} />;
}