import { Request, Response } from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../models/categories.model";

export const getCategoriesList = async (_: Request, res: Response) => {
  try {
    const data = await getCategories();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error recuperando categorias", error: err });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { categoria_nombre, categoria_estatus } = req.body;

  if (!categoria_nombre || typeof categoria_nombre !== "string") {
    return res.status(400).json({ message: "Nombre de categoria es requerido y debe ser un string" });
  }

  if (categoria_estatus !== undefined && typeof categoria_estatus !== 'boolean') {
    return res.status(400).json({ message: 'Estatus de la categoria debe ser un booleano' });
  }

  try {
    const newCategory = await addCategory(categoria_nombre, categoria_estatus);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Error creando categoria", error: err });
  }
};

export const renovateCategory = async (req: Request, res: Response) => {
  const id_categoria = parseInt(req.params.id_categoria);
  const { categoria_nombre, categoria_estatus } = req.body;

  if (isNaN(id_categoria)) {
    return res.status(400).json({ message: "ID de categoria invalido" });
  }

  const fieldsToUpdate: { categoria_nombre?: string; categoria_estatus?: boolean } = {};

  if (categoria_nombre !== undefined) {
    if (typeof categoria_nombre !== 'string' || categoria_nombre.trim() === '') {
      return res.status(400).json({ message: 'Nombre de categoria debe de ser un string' });
    }
    fieldsToUpdate.categoria_nombre = categoria_nombre;
  }

  if (categoria_estatus !== undefined) {
    fieldsToUpdate.categoria_estatus = [1, '1', 'true', true].includes(categoria_estatus);
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: 'No fields to update provided.' });
  }

  try {
    const updatedCategory = await updateCategory(id_categoria, fieldsToUpdate);
    res.status(201).json(updatedCategory);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error actualizando categoria", error: err });
  }
};

export const eliminateCategory = async (req: Request, res: Response) => {
  const ids = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Un arreglo de categorias es necesario." });
  }

  try {
    await deleteCategory(ids);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error eliminando categoria", error: err });
  }
};

export const getCategoryId = async (req: Request, res: Response) => {
  const id_categoria = parseInt(req.params.id_categoria);

  if (isNaN(id_categoria)) {
    return res.status(400).json({ message: "ID de categoria invalido" });
  }

  try {
    const category = await getCategoryById(id_categoria);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Categoria no encontrada" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error recuperando categoria", error: err });
  }
};
