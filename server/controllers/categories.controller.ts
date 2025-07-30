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
  const { categoria_nombre } = req.body;

  if (!categoria_nombre || typeof categoria_nombre !== "string") {
    return res.status(400).json({ message: "Nombre de categoria es requerido y debe ser un string" });
  }

  try {
    await addCategory(categoria_nombre);
    res.status(201).json({ message: "Categoria creada" });
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

  if (!categoria_nombre || typeof categoria_nombre !== "string") {
    return res.status(400).json({ message: "Nombre de categoria es requerido y debe ser un string" });
  }

  if (!categoria_estatus || typeof categoria_estatus !== "boolean") {
    return res.status(400).json({ message: "Estatus de categoria es requerido y debe ser un booleano" });
  }

  try {
    await updateCategory(id_categoria, categoria_nombre, categoria_estatus);
    res.json({ message: "Categoria actualizada" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error actualizando categoria", error: err });
  }
};

export const eliminateCategory = async (req: Request, res: Response) => {
  const id_categoria = parseInt(req.params.id_categoria);

  if (isNaN(id_categoria)) {
    return res.status(400).json({ message: "ID de categoria invalido" });
  }

  try {
    await deleteCategory(id_categoria);
    res.json({ message: "Categoria eliminada" });
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
