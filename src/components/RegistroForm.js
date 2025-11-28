
'use client'; 

import { useState } from 'react';
import { supabase } from '@/utils/supabase'; // Importa la conexión a Supabase
import styles from './Formulario.module.css'; 

export default function RegistroForm() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setCargando(true);
        setMensaje({ text: '', type: '' });

        // ---  Validaciones ---
        if (!nombre || !correo || !correo.includes('@') || !correo.includes('.')) {
            setMensaje({ text: 'Por favor, ingresa datos válidos.', type: 'error' });
            setCargando(false);
            return;
        }
        
        setMensaje({ text: 'Registrando...', type: 'info' });

        // --- Inserción en Supabase ---
        const { error: dbError } = await supabase
            .from('asistentes')
            .insert([{ nombre, correo }]);
        
        // --- Manejo de Respuesta de Supabase ---
        if (dbError) {
            console.error('Error al registrakkkkr:', dbError);
            const text = dbError.code === '23505' 
                ? 'Ese correo ya fue registrado. ¡Gracias!' 
                : 'Error al registrar la asistencia.';
            setMensaje({ text, type: 'error' });
        } else {
            // --- Llamar al endpoint de API para enviar el correo (Server-side) ---
            const response = await fetch('/api/enviar-correo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo }),
            });

            if (response.ok) {
                setMensaje({ text: `¡Registro y correo exitoso para ${nombre}!`, type: 'success' });
            } else {
                setMensaje({ text: `¡Registro exitoso! (Error al enviar correo de confirmación)`, type: 'warning' });
            }
            
            setNombre('');
            setCorreo('');
        }
        
        setCargando(false);
    };

    // Función auxiliar para determinar la clase CSS 
    const getMessageClass = () => {
        if (mensaje.type === 'success') return styles.mensajeExito;
        if (mensaje.type === 'error') return styles.mensajeError;
        if (mensaje.type === 'info') return styles.mensajeInfo;
        if (mensaje.type === 'warning') return styles.mensajeAdvertencia;
        return '';
    };

    return (
        <div className={styles.container}>
            <h1>Formulario de Asistencia</h1>

            {/* Mensaje de retroalimentación al usuario */}
            {mensaje.text && <p className={getMessageClass()}>{mensaje.text}</p>}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={styles.form}>
                
                <div className={styles.formGroup}>
                    <label htmlFor="nombre" className={styles.label}>Nombre Completo:</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={styles.input}
                        placeholder="Ej: Nombre y Apellido"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="correo" className={styles.label}>Correo Electrónico:</label>
                    <input
                        id="correo"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className={styles.input}
                        placeholder="Ej: tucorreo@ejemplo.com"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className={styles.button}
                    disabled={cargando} 
                >
                    {cargando ? 'Registrando...' : 'Registrar Asistencia'}
                </button>
            </form>
        </div>
    );
}