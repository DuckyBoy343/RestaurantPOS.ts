import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { type Table } from '@/types/table';
import { useForm } from 'react-hook-form';

interface TableModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: Omit<Table, 'id_mesa'>) => void;
    initialData?: Table | null;
}

export default function TableModal({ show, onHide, onSave, initialData }: TableModalProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Table, 'id_mesa'>>({
        defaultValues: {
            mesa_nombre: initialData?.mesa_nombre || '',
            mesa_estatus: initialData?.mesa_estatus ?? true,
        }
    });

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            reset({
                mesa_nombre: initialData.mesa_nombre,
                mesa_estatus: initialData.mesa_estatus,
            });
        } else {
            reset({
                mesa_nombre: '',
                mesa_estatus: true,
            });
        }
    }, [initialData, reset]);

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit(onSave)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar mesa' : 'Añadir nueva mesa'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="mesa_nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("mesa_nombre", { required: "El nombre de la mesa es obligatorio" })}
                            isInvalid={!!errors.mesa_nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.mesa_nombre?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mesa_estatus">
                        <Form.Check
                            type="switch"
                            label="Activo"
                            {...register("mesa_estatus")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Guardar cambios' : 'Añadir mesa'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
