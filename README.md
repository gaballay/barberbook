# ✂ BarberBook — App de Turnos para Peluquería

Aplicación completa de reservas con perfiles **Admin** y **Usuario**, calendario interactivo y envío de emails de confirmación.

---

## 🚀 Instalación y arranque

```bash
# 1. Instalá las dependencias
npm install

# 2. Corré el servidor de desarrollo
npm start
```

La app queda disponible en **http://localhost:3000**

---

## 👤 Credenciales de prueba

| Perfil | Email | Contraseña |
|--------|-------|------------|
| **Admin** | admin@barberbook.com | admin123 |
| **Usuario** | Creá tu cuenta desde /register | Tu contraseña |

---

## 📧 Configurar envío de emails (EmailJS)

Por defecto, el email de confirmación se imprime en la **consola del navegador** (modo demo).

Para activar el envío real:

1. Creá una cuenta gratis en [emailjs.com](https://www.emailjs.com)
2. Creá un **Email Service** (Gmail, Outlook, etc.)
3. Creá un **Email Template** con estas variables:
   - `{{to_name}}` — nombre del cliente
   - `{{to_email}}` — email del cliente
   - `{{service}}` — nombre del servicio
   - `{{date}}` — fecha del turno
   - `{{time}}` — horario del turno
   - `{{appointment_id}}` — ID único del turno
4. Abrí `src/utils/emailService.js` y reemplazá:

```js
const EMAILJS_SERVICE_ID = 'service_XXXXXXX';   // tu Service ID
const EMAILJS_TEMPLATE_ID = 'template_XXXXXXX'; // tu Template ID
const EMAILJS_PUBLIC_KEY = 'XXXXXXXXXXXXXXXX';   // tu Public Key
```

---

## 🏗 Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.js / .css       — Barra de navegación
│   └── Calendar.js / .css     — Calendario interactivo
├── context/
│   ├── AuthContext.js         — Autenticación (usuarios, login, register)
│   └── AppointmentsContext.js — Gestión de turnos
├── pages/
│   ├── Home.js / .css         — Landing page
│   ├── Login.js               — Inicio de sesión
│   ├── Register.js            — Registro de usuario
│   ├── Booking.js / .css      — Reserva de turnos (usuario)
│   └── Admin.js / .css        — Panel admin
├── utils/
│   └── emailService.js        — Integración EmailJS
└── styles.css                 — Estilos globales y variables CSS
```

---

## ⚙️ Funcionalidades

### Usuario
- ✅ Registro y login con validaciones
- ✅ Calendario visual con días disponibles/no disponibles
- ✅ Los domingos están bloqueados (cerrado)
- ✅ Los días pasados están deshabilitados
- ✅ Selección de servicio (Corte, Barba, Combo, Cejas)
- ✅ Slots de horario (disponibles/ocupados visualmente)
- ✅ Email de confirmación al reservar
- ✅ Lista de turnos propios con opción de cancelar

### Admin
- ✅ Dashboard con estadísticas (turnos activos, hoy, clientes)
- ✅ Calendario con contador de turnos por día
- ✅ Vista de turnos por día seleccionado
- ✅ Tabla completa de todos los turnos con filtro por fecha
- ✅ Crear turno manualmente
- ✅ Editar cualquier turno (cliente, fecha, hora, servicio, estado)
- ✅ Eliminar turnos
- ✅ Estados: Confirmado / Pendiente / Cancelado

---

## 💾 Persistencia de datos

Los datos se guardan en **localStorage** del navegador. Para una app en producción, reemplazá el contexto por llamadas a una API real (Node.js + MongoDB, Supabase, Firebase, etc.).

---

## 🎨 Servicios disponibles

| Servicio | Duración | Precio |
|----------|----------|--------|
| Corte de Cabello | 30 min | $2.500 |
| Arreglo de Barba | 30 min | $1.800 |
| Corte + Barba | 60 min | $3.800 |
| Perfilado de Cejas | 15 min | $800 |

Para modificar los servicios, editá el array `SERVICES` en `src/context/AppointmentsContext.js`.

Para modificar los horarios, editá el array `TIME_SLOTS` en el mismo archivo.
