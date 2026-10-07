import logo from '../assets/Logo-Adoptly.jpg';
 
export default function Header() {
return (
<header>
 
<div>
{logo}
 
<h2>ADOPTLY</h2>
</div>
 
<nav>
<button>Inicio</button>
<button>Explorar Mascotas</button>
<button>Fundaciones</button>
<button>Sobre Nosotros</button>
</nav>
 
<div>
<button>Registrarse</button>
<button>Ingresar</button>
</div>
 
</header>
);
}