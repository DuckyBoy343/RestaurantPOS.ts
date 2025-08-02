import RolesClient from '../roles/RolesClient';
import { fetchRoles } from '@/services/roles';
import { Role } from '@/types/role';

export default async function ManageRolesPage() {
  const roles: Role[] = await fetchRoles();

  const formattedRoles = roles.map(role => ({
    id: role.id_rol,
    ...role,
  }));

  return <RolesClient initialItems={formattedRoles} />;
}