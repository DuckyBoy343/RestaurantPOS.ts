import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { type Role } from '@/types/role';
import { useForm } from 'react-hook-form';

interface RoleModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: Omit<Role, 'id_rol'>) => void;
    initialData?: Role | null;
}

export default function RoleModal({ show, onHide, onSave, initialData }: RoleModalProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<Role, 'id_rol'>>({
        defaultValues: {
            rol_nombre: initialData?.rol_nombre || '',
            rol_estatus: initialData?.rol_estatus ?? true,
        }
    });

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            reset({
                rol_nombre: initialData.rol_nombre,
                rol_estatus: initialData.rol_estatus,
            });
        } else {
            reset({
                rol_nombre: '',
                rol_estatus: true,
            });
        }
    }, [initialData, reset]);

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit(onSave)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar rol' : 'Añadir nuevo rol'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="rol_nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("rol_nombre", { required: "El nombre del rol es obligatorio" })}
                            isInvalid={!!errors.rol_nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.rol_nombre?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="rol_estatus">
                        <Form.Check
                            type="switch"
                            label="Activo"
                            {...register("rol_estatus")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Guardar cambios' : 'Añadir rol'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
