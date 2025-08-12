'use client';

import 'bootstrap-icons/font/bootstrap-icons.css';
import LogOutButton from '@/components/LogoutButton';
import { CustomLink } from '@/components/CustomLink'; // Adjust path as needed

export default function MainMenu() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className='container-fluid'>
                <CustomLink className="navbar-brand" href="/floor">
                    <i className="bi bi-house-door-fill me-2"></i>
                    Restaurant
                </CustomLink>
                <button
                    className='navbar-toggler'
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#menuLateral"
                    title="Abrir menú lateral"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <section className="offcanvas offcanvas-start bg-dark" id="menuLateral" tabIndex={-1}>
                    <div className="offcanvas-header" data-bs-theme="dark">
                        <h5 className="offcanvas-title text-info fw-semibold fs-4">Menú</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>

                    <div className="offcanvas-body d-flex flex-column justify-content-between px-0">
                        <ul className="navbar-nav fs-5 justify-content-evenly">
                            <li className="nav-item p-3 py-md-1">
                                <CustomLink href="/floor" className="nav-link">
                                    Piso de venta
                                </CustomLink>
                            </li>
                            <li className="nav-item dropdown p-3 py-md-1">
                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Configuración</a>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li>
                                        <CustomLink href="/dashboard/tables" className="dropdown-item">
                                            Mesas
                                        </CustomLink>
                                    </li>
                                    <li>
                                        <CustomLink href="/dashboard/products" className="dropdown-item">
                                            Productos
                                        </CustomLink>
                                    </li>
                                    <li>
                                        <CustomLink href="/dashboard/categories" className="dropdown-item">
                                            Categorías
                                        </CustomLink>
                                    </li>
                                    <li>
                                        <CustomLink href="/dashboard/users" className="dropdown-item">
                                            Usuarios
                                        </CustomLink>
                                    </li>
                                    <li>
                                        <CustomLink href="/dashboard/inventory" className="dropdown-item">
                                            Bitacora de inventarios
                                        </CustomLink>
                                    </li>
                                    <li>
                                        <CustomLink href="/dashboard/roles" className="dropdown-item">
                                            Roles
                                        </CustomLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <div className="d-long d-md-flex justify-content-center p-3">
                            <LogOutButton />
                        </div>
                    </div>
                </section>
            </div>
        </nav>
    );
}