export async function fetchRoles() {
  return fetch('/api/roles').then(res => res.json());
}

export async function fetchRoleById(id_Rol: number) {
  return fetch(`/api/roles/${id_Rol}`).then(res => res.json());
}

export async function createRole(data: {
  Rol_nombre: string;
}) {
  const res = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateRole(id_Rol: number, data: {
  Rol_nombre: string;
  Rol_estatus: boolean;
}) {
  const res = await fetch(`/api/roles/${id_Rol}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteRole(id_Rol: number) {
  const res = await fetch(`/api/roles/${id_Rol}`, {
    method: 'DELETE',
  });

  return res.json();
}
