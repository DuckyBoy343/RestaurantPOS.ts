import 'bootstrap/dist/css/bootstrap.min.css';
//import styles from "../styles/MenuStyles.module.css";



export default function MainMenu() {
return (

<html lang="en">
<head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <title>Restaurant</title>
    <link rel="stylesheet" href="MenuStyles.css"></link>
</head>

<body>

    <div className="navbar navbar-expand-lg navbar-light bg-dark">
    
       <div className='container-fluid container'>    
       
         <a href="#" className="navbar-brand">Menu</a>
         <button className='navbar-toggler' type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon">

            </span>
         </button>

         <div className="collapse navbar-collapse" id="navbarSupportedContent"> 
            <ul className="navbar-nav"> 

                <li className="nav-item">
                    <a href="#" className="nav_link"> Inicio </a>
                </li>

            </ul>
         </div>
       </div> 


    </div>
   
</body>
</html>
);
}
