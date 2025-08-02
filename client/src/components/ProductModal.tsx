import { useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { type Product } from '@/types/product';
import { type Category } from '@/types/category';
import { useForm } from 'react-hook-form';

interface ProductModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: Omit<Product, 'id_producto'>) => void;
    initialData?: Product | null;
    categories: Category[];
}

export default function ProductModal({ show, onHide, onSave, initialData, categories }: ProductModalProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Product, 'id_producto'>>();

    const isEditing = !!initialData;

    useEffect(() => {
        if (show) {
            const defaultValues = {
                producto_nombre: initialData?.producto_nombre || '',
                producto_descripcion: initialData?.producto_descripcion || '',
                id_categoria: initialData?.id_categoria || undefined,
                producto_precio: initialData?.producto_precio || 0,
                producto_costo: initialData?.producto_costo || 0,
                producto_cantidad: initialData?.producto_cantidad || 0,
                producto_cantidad_minima: initialData?.producto_cantidad_minima || 0,
                producto_disponible: initialData?.producto_disponible ?? true,
            };
            reset(defaultValues);
        }
    }, [show, initialData, reset]);

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit(onSave)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar producto' : 'Añadir nuevo producto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="producto_nombre">
                        <Form.Label>Nombre del Producto</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("producto_nombre", { required: "El nombre es obligatorio" })}
                            isInvalid={!!errors.producto_nombre}
                        />
                        <Form.Control.Feedback type="invalid">{errors.producto_nombre?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="producto_descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            {...register("producto_descripcion")}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="id_categoria">
                        <Form.Label>Categoría</Form.Label>
                        <select
                            className="form-control"
                            aria-label="Categoría"
                            {...register("id_categoria", { required: "Debe seleccionar una categoría", valueAsNumber: true })}
                        >
                            <option value="">Seleccione una categoría...</option>
                            {categories.map(cat => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>
                                    {cat.categoria_nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_categoria && (<div className="invalid-feedback">{errors.id_categoria.message}</div>)}
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="producto_precio">
                            <Form.Label>Precio (Venta)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                {...register("producto_precio", { required: "El precio es obligatorio", valueAsNumber: true, min: { value: 0, message: "El precio no puede ser negativo" } })}
                                isInvalid={!!errors.producto_precio}
                            />
                            <Form.Control.Feedback type="invalid">{errors.producto_precio?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="producto_costo">
                            <Form.Label>Costo</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                {...register("producto_costo", { required: "El costo es obligatorio", valueAsNumber: true, min: { value: 0, message: "El costo no puede ser negativo" } })}
                                isInvalid={!!errors.producto_costo}
                            />
                            <Form.Control.Feedback type="invalid">{errors.producto_costo?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="producto_cantidad">
                        <Form.Label>Cantidad en Stock</Form.Label>
                        <Form.Control
                            type="number"
                            {...register("producto_cantidad", { required: "La cantidad es obligatoria", valueAsNumber: true, min: { value: 0, message: "La cantidad no puede ser negativa" } })}
                            isInvalid={!!errors.producto_cantidad}
                        />
                        <Form.Control.Feedback type="invalid">{errors.producto_cantidad?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="producto_cantidad_minima">
                        <Form.Label>Cantidad Mínima en Stock</Form.Label>
                        <Form.Control
                            type="number"
                            {...register("producto_cantidad_minima", { required: "La cantidad mínima es obligatoria", valueAsNumber: true, min: { value: 0, message: "La cantidad no puede ser negativa" } })}
                            isInvalid={!!errors.producto_cantidad_minima}
                        />
                        <Form.Control.Feedback type="invalid">{errors.producto_cantidad_minima?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="producto_disponible">
                        <Form.Check
                            type="switch"
                            label="Disponible para la venta"
                            {...register("producto_disponible")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
