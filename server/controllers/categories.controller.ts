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
  const { Categoria_nombre } = req.body;

  if (!Categoria_nombre || typeof Categoria_nombre !== "string") {
    return res.status(400).json({ message: "Nombre de categoria es requerido y debe ser un string" });
  }

  try {
    await addCategory(Categoria_nombre);
    res.status(201).json({ message: "Categoria creada" });
  } catch (err) {
    res.status(500).json({ message: "Error creando categoria", error: err });
  }
};

export const renovateCategory = async (req: Request, res: Response) => {
  const id_Categoria = parseInt(req.params.id_Categoria);
  const { Categoria_nombre, Categoria_estatus } = req.body;

  if (isNaN(id_Categoria)) {
    return res.status(400).json({ message: "ID de categoria invalido" });
  }

  if (!Categoria_nombre || typeof Categoria_nombre !== "string") {
    return res.status(400).json({ message: "Nombre de categoria es requerido y debe ser un string" });
  }

  if (!Categoria_estatus || typeof Categoria_estatus !== "boolean") {
    return res.status(400).json({ message: "Estatus de categoria es requerido y debe ser un booleano" });
  }

  try {
    await updateCategory(id_Categoria, Categoria_nombre, Categoria_estatus);
    res.json({ message: "Categoria actualizada" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error actualizando categoria", error: err });
  }
};

export const eliminateCategory = async (req: Request, res: Response) => {
  const id_Categoria = parseInt(req.params.id_Categoria);

  if (isNaN(id_Categoria)) {
    return res.status(400).json({ message: "ID de categoria invalido" });
  }

  try {
    await deleteCategory(id_Categoria);
    res.json({ message: "Categoria eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando categoria", error: err });
  }
};

export const getCategoryId = async (req: Request, res: Response) => {
  const id_Categoria = parseInt(req.params.id_Categoria);

  if (isNaN(id_Categoria)) {
    return res.status(400).json({ message: "ID de categoria invalido" });
  }

  try {
    const category = await getCategoryById(id_Categoria);
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
