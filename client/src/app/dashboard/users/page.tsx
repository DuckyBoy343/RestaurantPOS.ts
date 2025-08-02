import UsersClient from '../users/UsersClient';
import { fetchUsers } from '@/services/users';
import { User } from '@/types/user';

export default async function ManageUsersPage() {
  const users: User[] = await fetchUsers();

  const formattedUsers = users.map(user => ({
    id: user.id_usuario ,
    ...user,
  }));

  return <UsersClient initialItems={formattedUsers} />;
}
