import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from '../components/Calendar';
import { useAuth } from '../context/AuthContext';
import { useAppointments, TIME_SLOTS, SERVICES } from '../context/AppointmentsContext';
import { sendConfirmationEmail } from '../utils/emailService';
import './Booking.css';

export default function Booking() {
  const { user } = useAuth();
  const { appointments, getSlotAvailability, createAppointment, getUserAppointments, deleteAppointment } = useAppointments();

  const [step, setStep] = useState(1); // 1=fecha, 2=servicio+hora, 3=confirmado
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState(null);

  const userAppts = getUserAppointments(user.id);
  const activeAppts = userAppts.filter(a => a.status !== 'cancelled');

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedService || !selectedTime) return;
    setLoading(true);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const service = SERVICES.find(s => s.id === selectedService);

    const appt = createAppointment({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      date: dateKey,
      time: selectedTime,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      status: 'confirmed',
    });

    await sendConfirmationEmail({
      userName: user.name,
      userEmail: user.email,
      service: service.name,
      date: format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es }),
      time: selectedTime,
      appointmentId: appt.id,
    });

    setConfirmedAppt(appt);
    setStep(3);
    setLoading(false);
  };

  const handleCancel = (id) => {
    if (window.confirm('¿Cancelar este turno?')) deleteAppointment(id);
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedService(null);
    setSelectedTime(null);
    setConfirmedAppt(null);
  };

  return (
    <div className="booking-page page-wrapper">
      <div className="booking-header">
        <h1>Reservar Turno</h1>
        <p>Hola, <strong>{user.name}</strong>. Elegí el día y horario que más te convenga.</p>
      </div>

      <div className="booking-layout">
        {/* Columna principal */}
        <div className="booking-main">
          {step === 3 ? (
            <div className="booking-success card">
              <div className="success-icon">✓</div>
              <h2>¡Turno confirmado!</h2>
              <p>Se envió un email de confirmación a <strong>{user.email}</strong></p>
              <div className="appt-summary">
                <div className="summary-row">
                  <span>Servicio</span>
                  <strong>{SERVICES.find(s => s.id === confirmedAppt?.serviceId)?.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Fecha</span>
                  <strong>{confirmedAppt && format(new Date(confirmedAppt.date + 'T00:00:00'), "EEEE d 'de' MMMM", { locale: es })}</strong>
                </div>
                <div className="summary-row">
                  <span>Hora</span>
                  <strong>{confirmedAppt?.time} hs</strong>
                </div>
                <div className="summary-row">
                  <span>Precio</span>
                  <strong>${confirmedAppt?.price?.toLocaleString()}</strong>
                </div>
              </div>
              <button className="btn-primary" onClick={resetForm}>Reservar otro turno</button>
            </div>
          ) : (
            <>
              {/* Step indicators */}
              <div className="steps">
                {['Elegí el día', 'Servicio y hora', 'Confirmación'].map((s, i) => (
                  <div key={i} className={`step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                    <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
                    <span className="step-label">{s}</span>
                  </div>
                ))}
              </div>

              {step >= 1 && (
                <div className="booking-section">
                  <h3>Seleccioná el día</h3>
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    appointments={appointments}
                  />
                </div>
              )}

              {step >= 2 && selectedDate && (
                <>
                  <div className="booking-section">
                    <h3>Elegí el servicio</h3>
                    <div className="services-select">
                      {SERVICES.map(s => (
                        <button
                          key={s.id}
                          className={`service-opt ${selectedService === s.id ? 'selected' : ''}`}
                          onClick={() => setSelectedService(s.id)}
                        >
                          <span className="so-name">{s.name}</span>
                          <span className="so-meta">{s.duration} min · ${s.price.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="booking-section">
                    <h3>Elegí el horario</h3>
                    <p className="section-sub">
                      {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} —
                      Los horarios tachados ya están reservados
                    </p>
                    <div className="time-grid">
                      {TIME_SLOTS.map(time => {
                        const available = getSlotAvailability(format(selectedDate, 'yyyy-MM-dd'), time);
                        return (
                          <button
                            key={time}
                            className={`time-slot ${!available ? 'unavailable' : ''} ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => available && setSelectedTime(time)}
                            disabled={!available}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedService && selectedTime && (
                    <div className="booking-confirm">
                      <div className="confirm-summary">
                        <span>{SERVICES.find(s => s.id === selectedService)?.name}</span>
                        <span>·</span>
                        <span>{format(selectedDate, "d/MM/yyyy")}</span>
                        <span>·</span>
                        <span>{selectedTime} hs</span>
                      </div>
                      <button
                        className="btn-primary"
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{padding:'13px 32px', fontSize:'15px'}}
                      >
                        {loading ? 'Confirmando...' : 'Confirmar turno →'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Sidebar: mis turnos */}
        <div className="booking-sidebar">
          <h3>Mis Turnos</h3>
          {activeAppts.length === 0 ? (
            <p className="empty-state">No tenés turnos próximos.</p>
          ) : (
            <div className="appt-list">
              {activeAppts
                .sort((a, b) => (a.date + a.time) > (b.date + b.time) ? 1 : -1)
                .map(appt => (
                  <div key={appt.id} className="appt-card">
                    <div className="appt-info">
                      <strong>{appt.serviceName}</strong>
                      <span>
                        {format(new Date(appt.date + 'T00:00:00'), "d 'de' MMM", { locale: es })} · {appt.time} hs
                      </span>
                      <span className="appt-price">${appt.price?.toLocaleString()}</span>
                    </div>
                    <button className="btn-danger" onClick={() => handleCancel(appt.id)}>✕</button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
