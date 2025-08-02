import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { type Category } from '@/types/category';
import { useForm } from 'react-hook-form';

interface CategoryModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: Omit<Category, 'id_mesa'>) => void;
    initialData?: Category | null;
}

export default function CategoryModal({ show, onHide, onSave, initialData }: CategoryModalProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Category, 'id_mesa'>>({
        defaultValues: {
            categoria_nombre: initialData?.categoria_nombre || '',
            categoria_estatus: initialData?.categoria_estatus ?? true,
        }
    });

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            reset({
                categoria_nombre: initialData.categoria_nombre,
                categoria_estatus: initialData.categoria_estatus,
            });
        } else {
            reset({
                categoria_nombre: '',
                categoria_estatus: true,
            });
        }
    }, [initialData, reset]);

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit(onSave)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar categoria' : 'Añadir nueva categoria'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="categoria_nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("categoria_nombre", { required: "El nombre de la categoria es obligatorio" })}
                            isInvalid={!!errors.categoria_nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.categoria_nombre?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="categoria_estatus">
                        <Form.Check
                            type="switch"
                            label="Activo"
                            {...register("categoria_estatus")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Guardar cambios' : 'Añadir categoria'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
