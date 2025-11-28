// src/app/page.js
'use client'; 
import { useState } from 'react';
import RegistroForm from '@/components/RegistroForm';
import ListaAsistentes from '@/components/ListaAsistentes';


export default function Home() {
  // Estado para saber qué vista está activa: 'registro' o 'dashboard'
  const [vistaActiva, setVistaActiva] = useState('registro');

  return (
    <main style={styles.mainContainer}> 
      <div style={styles.menuContainer}>
        <button 
          onClick={() => setVistaActiva('registro')}
          style={vistaActiva === 'registro' ? styles.tabActiva : styles.tab}
        >
          Formulario de Registro
        </button>
        <button 
          onClick={() => setVistaActiva('dashboard')}
          style={vistaActiva === 'dashboard' ? styles.tabActiva : styles.tab}
        >
          Dashboard de Asistencia
        </button>
      </div>
      

      <div style={styles.contenido}>
        {vistaActiva === 'registro' && <RegistroForm />}
        {vistaActiva === 'dashboard' && <ListaAsistentes />}
      </div>
    </main>
  );
}

// Estilos básicos para el menú
const styles = {
    mainContainer: { 
        minHeight: '100vh',
    },

    menuContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '30px', // Separación del superior
        marginBottom: '40px', // Separación del contenido
    },
    
    tab: {
        padding: '10px 20px',
        margin: '0 5px',
        border: '1px solid #ced4da', 
        borderRadius: '25px', 
        cursor: 'pointer',
        backgroundColor: '#ffffff', 
        color: '#6c757d', 
        fontSize: '15px',
        fontWeight: '500',
        transition: 'all 0.3s',
    },
    tabActiva: {
        padding: '10px 20px',
        margin: '0 5px',
        border: '1px solid #007bff', 
        borderRadius: '25px', 
        cursor: 'pointer',
        backgroundColor: '#007bff', 
        color: 'white',
        fontSize: '15px',
        fontWeight: '700',
        boxShadow: '0 6px 15px rgba(0, 123, 255, 0.48)', 
    },
    contenido: {
        padding: '0 20px', 
        display: 'flex',
        justifyContent: 'center', 
    }
};