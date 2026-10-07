import logo from '../assets/Logo-Adoptly.jpg';
import './Home.css';
 
export default function Home() {
return (
<div
style={{
maxWidth: '1200px',
margin: '0 auto',
padding: '40px'
}}
>
{/* HERO PRINCIPAL */}
 
<div
style={{
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
gap: '40px',
flexWrap: 'nowrap',
marginBottom: '80px'
}}
>
<div style={{ flex: 1 }}>
<h1
style={{
fontSize: '80px',
color: '#2f7d5f',
marginBottom: '10px'
}}
>
ADOPTLY
</h1>
 
<h2
style={{
fontSize: '36px',
color: '#374151'
}}
>
Unimos fundaciones, rescatistas y adoptantes en un solo lugar
</h2>
 
<p
style={{
fontSize: '18px',
lineHeight: '1.8'
}}
>
Encuentra mascotas en adopción, conoce su historia y conecta
con organizaciones comprometidas con brindarles una segunda
oportunidad de vida.
</p>
 
<div
style={{
display: 'flex',
gap: '15px',
marginTop: '25px'
}}
>
<button className="boton">
Explorar Mascotas
</button>
 
<button className="boton boton-secundario">
Iniciar Sesión
</button>
</div>
</div>

{/* Logo */}

<div style={{ flex: 1, textAlign: 'center' }}>
    <img
src={logo}
alt="Logo Adoptly"
ion 
style={{
    background: '#ffffff',
    width: '50x0px',
    borderRadius:'50px',
    marginBottom:'20px'

}}
></img>
</div>
</div>
 
{/* QUIENES SOMOS */}
 
<section
style={{
    
background: '#ffffff',
padding: '50px',
borderRadius: '20px',
marginBottom: '70px',
padding: '40px',
boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
}}
>
<h2 style={{ color: '#2f7d5f' }}>
¿Quiénes somos?
</h2>
 
<p
style={{
fontSize: '18px',
lineHeight: '1.8'
}}>
Somos una plataforma creada para apoyar a fundaciones y
rescatistas que trabajan diariamente por el bienestar animal.
Adoptly nace de la necesidad de organizar y centralizar los
procesos de adopción en un solo lugar.
</p>


</section>
 
{/* COMO FUNCIONA */}
 
<section
style={{
marginBottom: '60px',
padding: '10px'
}}
>
<h2
style={{
textAlign: 'center',
color: '#2f7d5f'
}}
>
¿Cómo funciona?
</h2>
 
<div
style={{
display: 'flex',
justifyContent: 'center',
gap: '30px',
flexWrap: 'wrap',
marginTop: '70px',
boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
}}
>
<div className="tarjeta">
<h3>🐾 Buscar</h3>
<p>
Explora mascotas disponibles para adopción.
</p>
</div>
 
<div className="tarjeta">
<h3>📨 Solicitar</h3>
<p>
Envía solicitudes directamente a las fundaciones.
</p>
</div>
 
<div className="tarjeta">
<h3>🏡 Adoptar</h3>
<p>
Coordina el proceso y encuentra un nuevo compañero.
</p>
</div>
</div>
</section>
 
{/* MASCOTAS DESTACADAS */}
 
<section>
<h2
style={{
textAlign: 'center',
color: '#2f7d5f',
padding: '30px',

}}
>
Mascotas destacadas
</h2>
 
<div
style={{
display: 'flex',
gap: '80px',
justifyContent: 'center',
flexWrap: 'wrap',
boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
}}
>
<div className="tarjeta"
style={{
    width:'250px',
    minHeight:'350px'
}}>
<h3>🐶 Max</h3>
<p>Perro • Bogotá</p>
</div>
 
<div className="tarjeta"
style={{
    width:'250px',
    minHeight:'350px'
}}>
<h3>🐱 Luna</h3>
<p>Gato • Medellín</p>
</div>
 
<div className="tarjeta"
style={{
    width:'250px',
    minHeight:'350px'
}}>
<h3>🐶 Rocky</h3>
<p>Perro • Cali</p>
</div>
</div>
</section>
</div>
);
} 