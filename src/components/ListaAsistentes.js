// src/components/ListaAsistentes.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; // Tu conexión a Supabase

export default function ListaAsistentes() {
  const [asistentes, setAsistentes] = useState([]);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const fetchAndSubscribe = async () => {
      // Lista inicial de asistentes (incluimos ID para la key única)
      const { data, error } = await supabase
        .from('asistentes')
        .select('id, nombre, created_at') 
        .order('created_at', { ascending: false }); 

      if (error) {
        console.error('Error al cargar asistentes:', error);
        setCargando(false);
        return;
      }
      
      setAsistentes(data || []);
      setCargando(false);


      const channel = supabase
        .channel('asistentes-channel') 
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'asistentes' },
          (payload) => {
            // Cuando un nuevo registro llega se añade al inicio de la lista
            setAsistentes((currentAsistentes) => [payload.new, ...currentAsistentes]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchAndSubscribe();
  }, []); 

  const totalRegistrados = asistentes.length;

  if (cargando) {
    return (
        <div style={{ ...styles.dashboard, ...styles.loading }}>
            Cargando lista de asistentes...
        </div>
    );
  }
  
  // Mapear los nombres para la lista
  const listaNombres = asistentes.map((a) => (
    <li key={a.id} style={styles.itemLista}>
      {a.nombre}
    </li>
  ));

  return (
    <div style={styles.dashboard}>
      
      {/* Título Principal */}
      <h2 style={styles.titulo}>Registros de Asistencia</h2>

      {/* Tarjeta del Contador */}
      <div style={styles.contadorCard}>
        <div style={styles.total}>{totalRegistrados}</div>
        <div style={styles.subtitulo}>TOTAL DE REGISTRADOS</div>
      </div>

      {/* Sección de la Lista */}
      <div style={styles.seccionLista}>
        <div style={styles.encabezadoLista}>Registrados</div>
        
        <ul style={styles.lista}>
          {totalRegistrados > 0 ? (
            listaNombres
          ) : (
            <li style={styles.itemLista}>Aún no hay usuarios registrados.</li>
          )}
        </ul>
      </div>
      
      {/* Última actualización */}
      <p style={{ ...styles.subtitulo, marginTop: '20px', fontSize: '11px' }}>
         Última actualización: {new Date().toLocaleTimeString('es-ES')}
      </p>

    </div>
  );
}

// --- ESTILOS ACTUALIZADOS PARA LA INTERFAZ DE DASHBOARD (CLARO/CELESTE) ---
const styles = {
    // Contenedor principal del dashboard (Tarjeta Blanca)
    dashboard: {
        maxWidth: '440px',
        margin: '0 auto',
        padding: '35px',
        color: '#171717', // Texto Negro
        backgroundColor: '#ffffff', // Fondo Blanco Puro
        border: 'none',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)', // Sombra suave
        borderRadius: '12px',
        textAlign: 'center',
    },
    titulo: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#007bff', // Tono Celeste (Color primario)
        fontWeight: '700',
        fontFamily: 'var(--font-sans), sans-serif',
    },
    // Estilos para la tarjeta del contador
    contadorCard: {
        backgroundColor: '#f8f9fa', // Gris claro sutil
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #e9ecef', // Borde muy sutil
    },
    total: {
        fontSize: '72px', 
        fontWeight: '800', 
        color: '#28a745', // Verde de éxito
        lineHeight: '1',
        fontFamily: 'var(--font-sans), sans-serif',
    },
    subtitulo: {
        fontSize: '14px',
        color: '#6c757d', // Gris oscuro
        marginTop: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans), sans-serif',
    },
    // Estilos para la sección de la lista
    seccionLista: {
        width: '100%',
        marginTop: '15px',
    },
    encabezadoLista: {
        fontSize: '16px',
        color: '#007bff', // Tono Celeste
        paddingBottom: '10px',
        borderBottom: '2px solid #007bff',
        fontWeight: '700',
        textTransform: 'uppercase',
        textAlign: 'left',
        fontFamily: 'var(--font-sans), sans-serif',
    },
    lista: {
        listStyle: 'none',
        padding: '0',
        textAlign: 'left',
        marginTop: '15px',
    },
    itemLista: {
        padding: '12px 0',
        borderBottom: '1px solid #e9ecef', // Separador muy sutil
        fontSize: '17px',
        color: '#171717',
        fontFamily: 'var(--font-sans), sans-serif',
        fontWeight: '500',
    },
    loading: {
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#6c757d',
        fontSize: '16px',
    }
};