export async function fetchCategories() { 
  return fetch('/api/categories').then(res => res.json());
}

export async function fetchCategoryById(id_Categoria: number) {
  return fetch(`/api/categories/${id_Categoria}`).then(res => res.json());
}

export async function createCategory(data: {
  Categoria_nombre: string;
}) {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateCategory(id_Categoria: number, data: {
  Categoria_nombre: string;
  Categoria_estatus: boolean;
}) {
  const res = await fetch(`/api/categories/${id_Categoria}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteCategory(id_Categoria: number) {
  const res = await fetch(`/api/categories/${id_Categoria}`, {
    method: 'DELETE',
  });

  return res.json();
}
