export async function fetchUsers() {
  return fetch('/api/users').then(res => res.json());
}

export async function fetchUserById(id_usuario: number) {
  return fetch(`/api/users/${id_usuario}`).then(res => res.json());
}

export async function createUser(data: {
  usuario_nombre: string;
  usuario_nombre_completo: string;
  usuario_hash_contra: string;
  id_rol: number;
}) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateUser(id_usuario: number, data: {
  usuario_nombre: string;
  usuario_nombre_completo: string;
  usuario_hash_contra: string;
  id_rol: number;
  usuario_estatus: boolean;
}) {
  const res = await fetch(`/api/users/${id_usuario}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteUser(id_usuario: number) {
  const res = await fetch(`/api/users/${id_usuario}`, {
    method: 'DELETE',
  });

  return res.json();
}
