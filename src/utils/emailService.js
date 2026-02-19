// ============================================================
// CONFIGURACIÓN DE EMAILJS
// 1. Creá una cuenta gratis en https://www.emailjs.com
// 2. Creá un Email Service (Gmail, Outlook, etc.)
// 3. Creá un Email Template con estas variables:
//    {{to_name}}, {{to_email}}, {{service}}, {{date}}, {{time}}, {{appointment_id}}
// 4. Reemplazá las constantes de abajo con tus credenciales
// ============================================================

const EMAILJS_SERVICE_ID = 'barberbook_service';
const EMAILJS_TEMPLATE_ID = 'template_o3t0czw';
const EMAILJS_PUBLIC_KEY = 'L31pA0MfGZyK_iupA';

export const sendConfirmationEmail = async ({ userName, userEmail, service, date, time, appointmentId }) => {
  // Si no configuraste EmailJS, solo logueamos en consola
  if (
    EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
    EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
  ) {
    console.log('📧 Email de confirmación (modo demo - configurá EmailJS):');
    console.log({ to: userEmail, userName, service, date, time, appointmentId });
    return { success: true, demo: true };
  }

  try {
    const emailjs = await import('emailjs-com');
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_name: userName,
        to_email: userEmail,
        service,
        date,
        time,
        appointment_id: appointmentId,
      },
      EMAILJS_PUBLIC_KEY
    );
    return { success: true };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error };
  }
};
