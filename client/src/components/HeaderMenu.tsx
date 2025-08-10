import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function MainMenu() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className='container-fluid'>
                <Link className="navbar-brand" href="/protected/dashboard">
                    <i className="bi bi-house-door-fill me-2"></i>
                    Restaurant POS
                </Link>

                <button className='navbar-toggler' type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <section className="offcanvas offcanvas-start bg-dark" id="menuLateral" tabIndex={-1}>
                    <div className="offcanvas-header" data-bs-theme="dark">
                        <h5 className="offcanvas-title text-info fw-semibold fs-4">MenÃº</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>

                    <div className="offcanvas-body d-flex flex-column justify-content-between px-0">
                        <ul className="navbar-nav fs-5 justify-content-evenly">
                            <li className="nav-item p-3 py-md-1">
                                <Link href="/protected/dashboard" className="nav-link">Inicio</Link>
                            </li>
                            <li className="nav-item p-3 py-md-1">
                                <Link href="/protected/tables" className="nav-link">Mesas</Link>
                            </li>
                            <li className="nav-item p-3 py-md-1">
                                <Link href="/protected/users" className="nav-link">Usuarios</Link>
                            </li>
                            <li className="nav-item p-3 py-md-1">
                                <Link href="/protected/products" className="nav-link">Productos</Link>
                            </li>
                            {/* Add more links as needed */}
                        </ul>
                    </div>
                </section>
            </div>
        </nav>
    );
}