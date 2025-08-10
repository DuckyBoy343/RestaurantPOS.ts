import 'bootstrap/dist/css/bootstrap.min.css';
//import styles from "../styles/HeaderDesign.module.css";




export default function MainHeader() {
  return (
    //<div className = {styles.mainbody}>
    //<nav className={styles.testheader}>
      <nav className="navbar bg-primary" data-bs-theme="dark">
      
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Restaurante</a>
    <a className="w-1 text-start" aria-current="page" style = {{ ["color"]: '#FFFFFF'}} href="#" >Catalogos</a>
    <a className="w-1 text-start" aria-current="page" style = {{ ["color"]: '#FFFFFF'}} href="#" >Mesas</a>
    <a className="w-1 text-start" aria-current="page" style = {{ ["color"]: '#FFFFFF'}} href="#" >Mesas</a>
    <a className="w-1 text-start" aria-current="page" style = {{ ["color"]: '#FFFFFF'}} href="#" >Productos</a>
    <a className="w-1 text-start" aria-current="page" style = {{ ["color"]: '#FFFFFF'}} href="#" >Inventario</a>
    <form className="d-flex" role="search">
      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" data-bs-theme="dark"/>
      <button className="btn btn-outline-success" type="submit" data-bs-theme="light">Search</button>
    </form>
    
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
      
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarScroll">
      <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style = {{ ['--bs-scroll-height' as any]: '100px' }}>
        <li className="nav-item">
        
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Link</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Link
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><hr className="dropdown-divider"></hr></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">Link</a>
        </li>
      </ul>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
    
//</div>
  );
}
