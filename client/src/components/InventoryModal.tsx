import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { Product } from '@/types/product';
import { InventoryLog } from '@/types/inventory';
import { fetchProducts } from '@/services/products';

type InventoryLogFormData = Omit<InventoryLog, 'id_bitacora_inventario' | 'fecha_registro' | 'producto_nombre' | 'id_producto'> & {
    id_producto: number | null;
};

interface InventoryLogModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: InventoryLogFormData) => void;
    initialData?: InventoryLog | null;
}

export default function InventoryLogModal({ show, onHide, onSave, initialData }: InventoryLogModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<InventoryLogFormData>();

    const isEditing = !!initialData;

    useEffect(() => {
        if (show && products.length === 0) {
            const getProducts = async () => {
                try {
                    const productsData = await fetchProducts();
                    setProducts(productsData);
                } catch (error) {
                    console.error("Failed to fetch products for modal", error);
                }
            };
            getProducts();
        }
    }, [show, products.length]);

    useEffect(() => {
        if (show) {
            if (initialData) {
                const associatedProduct = products.find(p => p.id_producto === initialData.id_producto);
                setProductSearch(associatedProduct?.producto_nombre || `Producto ID: ${initialData.id_producto}`);
                reset({
                    id_producto: initialData.id_producto,
                    cantidad: initialData.cantidad,
                    accion: initialData.accion,
                });
            } else {
                setProductSearch('');
                reset({
                    id_producto: undefined,
                    cantidad: 0,
                    accion: 'Ajuste Manual',
                });
            }
        }
    }, [show, initialData, reset, products]);

    const onSubmit = (data: InventoryLogFormData) => {
        let finalQuantity = Number(data.cantidad);
        if (data.accion === 'Merma' && finalQuantity > 0) {
            finalQuantity = -Math.abs(finalQuantity);
        }
        
        else if (data.accion === 'Entrada de Mercancía' && finalQuantity < 0) {
            finalQuantity = Math.abs(finalQuantity);
        }

        onSave({ 
            ...data, 
            cantidad: finalQuantity 
        });
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Ver Registro de Inventario' : 'Ajuste de Inventario Manual'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="producto">
                        <Form.Label>Producto</Form.Label>
                        <Controller
                            name="id_producto"
                            control={control}
                            rules={{ required: "Debe seleccionar un producto." }}
                            render={() => (
                                <>
                                    <Form.Control
                                        type="text"
                                        list="product-options"
                                        value={productSearch}
                                        onChange={(e) => {
                                            const search = e.target.value;
                                            setProductSearch(search);
                                            const selectedProduct = products.find(p => p.producto_nombre === search);
                                            setValue('id_producto', selectedProduct ? selectedProduct.id_producto : null, { shouldValidate: true });
                                        }}
                                        placeholder="Busque un producto..."
                                        isInvalid={!!errors.id_producto}
                                        disabled={isEditing}
                                    />
                                    <datalist id="product-options">
                                        {products.map(p => (
                                            <option key={p.id_producto} value={p.producto_nombre} />
                                        ))}
                                    </datalist>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.id_producto?.message}
                                    </Form.Control.Feedback>
                                </>
                            )}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="cantidad">
                        <Form.Label>Cantidad a Ajustar</Form.Label>
                        <Form.Control
                            type="number"
                            {...register("cantidad", {
                                required: "La cantidad es obligatoria.",
                                valueAsNumber: true,
                                validate: value => !isEditing && value !== 0 || isEditing || "La cantidad no puede ser cero."
                            })}
                            isInvalid={!!errors.cantidad}
                            placeholder="Ej: 50 para añadir, -5 para quitar"
                            disabled={isEditing}
                        />
                        <Form.Control.Feedback type="invalid">{errors.cantidad?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="accion">
                        <Form.Label>Tipo de Acción</Form.Label>
                        <select {...register("accion", { required: "Debe seleccionar una acción." })} disabled={isEditing}>
                            <option value="Entrada de Mercancía">Entrada de Mercancía</option>
                            <option value="Merma">Merma</option>
                        </select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {isEditing ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {!isEditing && (
                        <Button variant="primary" type="submit">
                            Guardar Ajuste
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
}