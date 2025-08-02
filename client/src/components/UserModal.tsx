import { useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { type User } from '@/types/user';
import { useForm } from 'react-hook-form';
import { type Role } from '@/types/role';

interface UserModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (data: Omit<User, 'id_usuario'>) => void;
    initialData?: User | null;
    roles: Role[];
}

export default function UserModal({ show, onHide, onSave, initialData, roles }: UserModalProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Omit<User, 'id_usuario'>>({
        defaultValues: {
            usuario_nombre: initialData?.usuario_nombre || '',
            usuario_estatus: initialData?.usuario_estatus ?? true,
        }
    });

    const isEditing = !!initialData;

    useEffect(() => {
        if (show) {
            const defaultValues = {
                usuario_nombre: initialData?.usuario_nombre || '',
                usuario_nombre_completo: initialData?.usuario_nombre_completo || '',
                usuario_hash_contra: '',
                id_rol: initialData?.id_rol || 0,
                usuario_estatus: initialData?.usuario_estatus ?? true,
            };
            reset(defaultValues);
        }
    }, [show, initialData, reset]);

    return (
        <Modal show={show} onHide={onHide}>
            <Form onSubmit={handleSubmit(onSave)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar usuario' : 'Añadir nuevo usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="usuario_nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("usuario_nombre", { required: "El nombre de usuario es obligatorio" })}
                            isInvalid={!!errors.usuario_nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.usuario_nombre?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="usuario_nombre_completo">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                            type="text"
                            {...register("usuario_nombre_completo", { required: "El nombre completo es obligatorio" })}
                            isInvalid={!!errors.usuario_nombre_completo}
                        />
                        <Form.Control.Feedback type="invalid">{errors.usuario_nombre_completo?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="usuario_hash_contra">
                        <Form.Label>Contraseña {isEditing && '(Opcional)'}</Form.Label>
                        <Form.Control
                            type="password"
                            {...register("usuario_hash_contra", {
                                required: isEditing ? false : "La contraseña es obligatoria",
                                minLength: isEditing ? undefined : { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                            })}
                            isInvalid={!!errors.usuario_hash_contra}
                            placeholder={isEditing ? 'Dejar en blanco para no cambiar' : ''}
                        />
                        <Form.Control.Feedback type="invalid">{errors.usuario_hash_contra?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="id_rol">
                        <Form.Label>Rol</Form.Label>
                        <select
                            className="form-control"
                            aria-label="Rol"
                            {...register("id_rol", { required: "Debe seleccionar un rol", valueAsNumber: true })}
                        >
                            <option value="" disabled>Seleccione un rol...</option>
                            {roles.map(role => (
                                <option key={role.id_rol} value={role.id_rol}>
                                    {role.rol_nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_rol && (
                            <div className="invalid-feedback">{errors.id_rol.message}</div>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="usuario_estatus">
                        <Form.Check
                            type="switch"
                            label="Activo"
                            {...register("usuario_estatus")}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        {isEditing ? 'Guardar cambios' : 'Añadir usuario'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
