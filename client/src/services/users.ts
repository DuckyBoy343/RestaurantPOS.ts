export async function fetchUsers() {
  return fetch('/api/users').then(res => res.json());
}

export async function fetchUserById(id_Usuario: number) {
  return fetch(`/api/users/${id_Usuario}`).then(res => res.json());
}

export async function createUser(data: {
  Usuario_nombre: string;
  Usuario_nombre_completo: string;
  Usuario_hash_contra: string;
  Usuario_rol: number;
}) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateUser(id_Usuario: number, data: {
  Usuario_nombre: string;
  Usuario_nombre_completo: string;
  Usuario_hash_contra: string;
  Usuario_rol: number;
  Usuario_estatus: boolean;
}) {
  const res = await fetch(`/api/users/${id_Usuario}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteUser(id_Usuario: number) {
  const res = await fetch(`/api/users/${id_Usuario}`, {
    method: 'DELETE',
  });

  return res.json();
}
