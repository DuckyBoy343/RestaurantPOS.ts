import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LogOutButton from '@/components/LogoutButton';

export default function MainMenu() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className='container-fluid'>
                <Link className="navbar-brand" href="/floor">
                    <i className="bi bi-house-door-fill me-2"></i>
                    Restaurant
                </Link>


                {/* <div className="row w-100 text-right"> */}
                    {/* <div className="col"> */}
                        <button className='navbar-toggler' type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    {/* </div> */}
                {/* </div> */}

                <section className="offcanvas offcanvas-start bg-dark" id="menuLateral" tabIndex={-1}>
                    <div className="offcanvas-header" data-bs-theme="dark">
                        <h5 className="offcanvas-title text-info fw-semibold fs-4">Menú</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>

                    <div className="offcanvas-body d-flex flex-column justify-content-between px-0">
                        <ul className="navbar-nav fs-5 justify-content-evenly">
                            <li className="nav-item p-3 py-md-1">
                                <Link href="/floor" className="nav-link">Piso de venta</Link>
                            </li>
                            <li className="nav-item dropdown p-3 py-md-1">
                                {/* <Link href="/protected/tables" className="nav-link">Configuración</Link> */}
                                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Configuración</a>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li>
                                        <Link href="/dashboard/tables" className="dropdown-item">Mesas</Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/products" className="dropdown-item">Productos</Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/categories" className="dropdown-item">Categorías</Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/users" className="dropdown-item">Usuarios</Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/inventory" className="dropdown-item">Bitacora de inventarios</Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard/roles" className="dropdown-item">Roles</Link>
                                    </li>

                                </ul>
                            </li>
                            {/* Add more links as needed */}
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