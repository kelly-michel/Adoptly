import logo from '../assets/Logo-Adoptly.jpg';
 
export default function Home() {
return (
<div style={{ textAlign: 'center', padding: '68px' }}>
 
<img
src={logo}
alt="Logo Adoptly"
style={{ width: '250px',
    borderRadius: '15px'
 }}
/>
 
<h1
style={{
fontSize: '55px',
color: '#1f6f63'
}}
>
ADOPTLY
</h1>
 
<h2
style={{
maxWidth: '700px',
margin: '0 auto',
color: '#2f3e46'
}}
>
Unimos fundaciones, rescatistas y adoptantes en un solo lugar
</h2>
<p>
  Encuentra mascotas en adopción, 
  conoce su historia y conecta con organizaciones comprometidas. 
  Brinda una segunda oportunidad de vida.  
</p>
<div style={{ marginTop: '30px' }}>
 
<button>
Explorar mascotas
</button>
 
<button style={{ marginLeft: '15px' }}>
Iniciar sesión
</button>
 
</div>
<hr style={{ margin: '50px 0' }} />
 
<h2>¿Quiénes somos?</h2>

<p>
Adoptly, orientado a facilitar la conexión 
entre fundaciones, personas que rescatan animales y usuarios 
interesados en adoptar mascotas.
</p>
<h2>¿Cómo funciona?</h2>
 
</div>
);
}