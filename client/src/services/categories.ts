export async function fetchCategories() { 
  return fetch('/api/categories').then(res => res.json());
}

export async function fetchCategoryById(id_categoria: number) {
  return fetch(`/api/categories/${id_categoria}`).then(res => res.json());
}

export async function createCategory(data: {
  categoria_nombre: string;
}) {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateCategory(id_categoria: number, data: {
  categoria_nombre: string;
  categoria_estatus: boolean;
}) {
  const res = await fetch(`/api/categories/${id_categoria}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteCategory(id_categoria: number) {
  const res = await fetch(`/api/categories/${id_categoria}`, {
    method: 'DELETE',
  });

  return res.json();
}
