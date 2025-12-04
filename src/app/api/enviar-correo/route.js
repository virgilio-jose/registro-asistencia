// src/app/api/enviar-correo/route.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Inicializa Resend. Next.js busca automáticamente la variable en .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { nombre, correo } = await request.json();

    if (!nombre || !correo) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    //La dirección 'from' DEBE ser una dirección verificada en Resend soporte@registro-asistencia.online
    const data = await resend.emails.send({
      from: 'Transformación Digital <soporte@registro-asistencia.online>', 
      to: [correo],
      subject: `¡Bienvenido(a) ${nombre}, tu asistencia ha sido confirmada!`,
      html: 
        `<html>
    <head>
        <style>
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                color: #343a40;
                line-height: 1.6;
            }
            .header {
                background-color: #007bff; /* Color principal (Celeste) */
                color: white;
                padding: 25px 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 30px 20px;
            }
            .details-box {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                margin-top: 20px;
                border-left: 5px solid #007bff;
            }
            .button {
                display: inline-block;
                padding: 12px 25px;
                margin-top: 20px;
                background-color: #28a745; /* Botón de acción (Verde) */
                color: white !important;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #6c757d;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 24px;">Confirmación de Asistencia</h1>
                <p style="margin: 5px 0 0;">JORNADA ACADÉMICA 2025</p>
            </div>

            <div class="content">
                <h2 style="color: #007bff;">¡Hola ${nombre}, tu lugar está asegurado!</h2>
                
                <p>Gracias por confirmar tu asistencia a la jornada "Transformación Digital: Retos en la Gerencia y Calidad de Software".</p>

                <div class="details-box">
                    <p style="margin: 0; font-weight: bold; color: #007bff;">Detalles del Evento:</p>
                    <ul style="list-style-type: none; padding: 0;">
                        <li> Fecha: Jueves, 4 de diciembre de 2025</li>
                        <li> Hora: 6:00 p.m. a 8:00 p.m.</li>
                        <li> Lugar: UTP - Centro Regional de Azuero</li>
                        <li> Conferencista: Licenciado Jorge Isaac García </li>
                        <li> Conferencista: Ingeniero Francisco Aguilar (SACSA) </li>
                    </ul>
                </div>

                <p style="margin-top: 25px;">Agradecemos tu interés. Esperamos que disfrutes de la jornada.</p>

                <a href="https://docs.google.com/forms/d/e/1FAIpQLSc0FssiTtrTaBNCqIq7pnT4vIb_eMqSFGk3SsJCuKdEfIpX6A/viewform" class="button" style="color: white; text-decoration: none;">
                    ¡Danos tu Opinión!
                </a>
            </div>

            <div class="footer">
                <p>Organizado por: Estudiantes de Calidad de Software y Gerencia de Proyectos, Coordinados por el Prof. José Ruiz.</p>
                <p>Universidad Tecnológica de Panamá - Centro Regional de Azuero.</p>
            </div>
        </div>
    </body>
</html>`,
    });

    return NextResponse.json({ message: 'Correo enviado con éxito', data }, { status: 200 });
  } catch (error) {
    console.error('Error en API Route /enviar-correo:', error);
    // Mensaje si la clave API falta o es incorrecta
    return NextResponse.json({ 
        error: 'Fallo al enviar el correo. Verifica tu clave RESEND_API_KEY y la dirección "from".' 
    }, { status: 500 });
  }
}
