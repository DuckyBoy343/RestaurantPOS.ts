import 'bootstrap/dist/css/bootstrap.min.css';
//import styles from "../styles/MenuStyles.module.css";

export default function MainMenu() {
    return (


        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Restaurant</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossOrigin="anonymous"></link>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"></link>
            </head>


            <body>
                <nav className="navbar navbar-dark bg-dark">


                    <div className='container-fluid'>
                        <a className="navbar-brand" href="#">
                            <i className="bi bi-person-standing"></i>
                            <img src="/docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30" className="d-inline-block align-start" alt=""></img>
                            Bootstrap
                        </a>
                        <a href="" className="navbar-brand text-info fw-seminbold fs-4">Menu</a>

                        <button className='navbar-toggler' type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <section className="offcanvas offcanvas-start bg-dark" id="menuLateral" tabIndex={-1}>

                            <div className="offcanvas-header" databas-theme="dark">
                                <h5 className="offcanvas-title text-info fw-seminbold fs-4">Menu</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>

                            <div className="offcanvas-body" d-flex flex-column justify-content-between px-0>
                                <ul className="navbar-nav fs-5 justify-content-evenly">
                                    <li className="nav-item p-3 py-md-1">
                                        <a href="#" className="nav-link">Inicio</a>
                                    </li>
                                    <li className="nav-item p-3 py-md-1">
                                        <a href="#" className="nav-link">Catalogos</a>
                                    </li>
                                    <li className="nav-item p-3 py-md-1">
                                        <a href="#" className="nav-link">Mesas</a>
                                    </li>
                                    <li className="nav-item p-3 py-md-1">
                                        <a href="#" className="nav-link">Productos</a>
                                    </li>
                                    <li className="nav-item p-3 py-md-1">
                                        <a href="#" className="nav-link">Inventario</a>
                                    </li>
                                </ul>
                            </div>

                            <div>


                            </div>

                        </section>

                    </div>
                </nav>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossOrigin="anonymous"></script>

            </body>
        </html>

    );
}