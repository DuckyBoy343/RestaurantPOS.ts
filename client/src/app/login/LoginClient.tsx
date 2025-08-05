'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import styles from '@/styles/Login.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Form, Card, InputGroup, Alert } from 'react-bootstrap';

export function LoginClient() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
        const data = await login(username, password);
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            router.push('/floor');
        }
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    }
};

    return (
        <div className={styles.mainContainer}>
            <Card className={styles.loginCard}>
                <Card.Body>
                    <Card.Title as="h2" className="text-center mb-2 fw-bold">
                        Iniciar Sesión
                    </Card.Title>
                    <Card.Text className="text-center text-muted mb-4">
                        Bienvenido al sistema
                    </Card.Text>

                    <Form onSubmit={handleSubmit}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text className={styles.inputIcon}>
                                <i className="bi bi-person-fill"></i>
                            </InputGroup.Text>
                            <Form.Control
                                className={styles.inputField}
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <InputGroup className="mb-4">
                            <InputGroup.Text className={styles.inputIcon}>
                                <i className="bi bi-lock-fill"></i>
                            </InputGroup.Text>
                            <Form.Control
                                className={styles.inputField}
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputGroup>

                        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                        <div className="d-grid mt-4">
                            <Button
                                type="submit"
                                size="lg"
                                className={styles.loginButton}
                            >
                                Ingresar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}