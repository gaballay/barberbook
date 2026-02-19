import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from '../components/Calendar';
import { useAppointments, TIME_SLOTS, SERVICES } from '../context/AppointmentsContext';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

export default function Admin() {
  const { appointments = [], createAppointment, updateAppointment, deleteAppointment } = useAppointments();

  const { users } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', appt?: {} }
  const [formData, setFormData] = useState({});
  const [filterDate, setFilterDate] = useState('');

  const dateAppts = getAppointmentsByDate(format(selectedDate, 'yyyy-MM-dd'));
  const allActive = (appointments || []).filter(a => a.status !== 'cancelled');

  const openCreate = () => {
    setFormData({
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '',
      serviceId: SERVICES[0].id,
      userName: '',
      userEmail: '',
      status: 'confirmed',
    });
    setModal({ mode: 'create' });
  };

  const openEdit = (appt) => {
    setFormData({ ...appt });
    setModal({ mode: 'edit', appt });
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    const service = SERVICES.find(s => s.id === formData.serviceId);
    if (!formData.date || !formData.time || !formData.userName) return alert('Completá todos los campos requeridos.');

    if (modal.mode === 'create') {
      createAppointment({
        ...formData,
        serviceName: service.name,
        price: service.price,
        userId: 'admin-created',
      });
    } else {
      updateAppointment(modal.appt.id, {
        ...formData,
        serviceName: service.name,
        price: service.price,
      });
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este turno?')) deleteAppointment(id);
  };

  const statusBadge = (s) => {
    const map = { confirmed: 'badge-green', cancelled: 'badge-red', pending: 'badge-gold' };
    const labels = { confirmed: 'Confirmado', cancelled: 'Cancelado', pending: 'Pendiente' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{labels[s] || s}</span>;
  };

  const filteredAll = filterDate ? allActive.filter(a => a.date === filterDate) : allActive;

  return (
    <div className="admin-page page-wrapper">
      <div className="admin-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Gestioná todos los turnos de la barbería</p>
        </div>
        <div className="admin-stats">
          <div className="stat">
            <span className="stat-n">{allActive.length}</span>
            <span className="stat-l">Activos</span>
          </div>
          <div className="stat">
            <span className="stat-n">{getAppointmentsByDate(format(new Date(), 'yyyy-MM-dd')).length}</span>
            <span className="stat-l">Hoy</span>
          </div>
          <div className="stat">
            <span className="stat-n">{(users || []).filter(u => u.role !== 'admin').length}</span>
            <span className="stat-l">Clientes</span>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        {/* Calendario */}
        <div className="admin-cal-col">
          <div className="admin-cal-header">
            <h3>Calendario</h3>
            <button className="btn-primary" style={{fontSize:'13px', padding:'9px 18px'}} onClick={openCreate}>
              + Nuevo turno
            </button>
          </div>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            appointments={appointments}
          />

          {/* Turnos del día seleccionado */}
          <div className="day-appts">
            <h4>
              {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
              <span className="count">{dateAppts.length}</span>
            </h4>
            {dateAppts.length === 0 ? (
              <p className="empty-state">Sin turnos este día.</p>
            ) : (
              dateAppts.sort((a, b) => a.time > b.time ? 1 : -1).map(appt => (
                <div key={appt.id} className="day-appt-row">
                  <div className="dar-time">{appt.time}</div>
                  <div className="dar-info">
                    <strong>{appt.userName}</strong>
                    <span>{appt.serviceName}</span>
                  </div>
                  <div className="dar-actions">
                    <button className="btn-ghost" style={{fontSize:'12px', padding:'5px 10px'}} onClick={() => openEdit(appt)}>✎</button>
                    <button className="btn-danger" style={{padding:'5px 10px', fontSize:'12px'}} onClick={() => handleDelete(appt.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tabla todos los turnos */}
        <div className="admin-table-col">
          <div className="table-header">
            <h3>Todos los turnos</h3>
            <div className="table-filter">
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                style={{background:'var(--bg3)', border:'1px solid var(--border)', color:'var(--text)', padding:'8px 12px', borderRadius:'8px', fontSize:'13px'}}
              />
              {filterDate && <button className="btn-ghost" onClick={() => setFilterDate('')} style={{fontSize:'12px'}}>✕ Limpiar</button>}
            </div>
          </div>

          <div className="appts-table">
            <div className="table-head">
              <span>Cliente</span>
              <span>Servicio</span>
              <span>Fecha</span>
              <span>Hora</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>
            {filteredAll.length === 0 ? (
              <div className="table-empty">No hay turnos para mostrar.</div>
            ) : (
              filteredAll
                .sort((a, b) => (a.date + a.time) > (b.date + b.time) ? 1 : -1)
                .map(appt => (
                  <div key={appt.id} className="table-row">
                    <div className="td-client">
                      <strong>{appt.userName}</strong>
                      <span>{appt.userEmail}</span>
                    </div>
                    <span className="td-service">{appt.serviceName}</span>
                    <span className="td-date">{format(new Date(appt.date + 'T00:00:00'), "d/MM/yy")}</span>
                    <span className="td-time">{appt.time} hs</span>
                    <div>{statusBadge(appt.status)}</div>
                    <div className="td-actions">
                      <button className="btn-ghost" style={{fontSize:'12px', padding:'5px 10px'}} onClick={() => openEdit(appt)}>Editar</button>
                      <button className="btn-danger" style={{padding:'5px 12px', fontSize:'12px'}} onClick={() => handleDelete(appt.id)}>Eliminar</button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Modal crear/editar */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal.mode === 'create' ? 'Nuevo Turno' : 'Editar Turno'}</h3>
              <button className="btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Nombre del cliente *</label>
                <input name="userName" value={formData.userName || ''} onChange={handleFormChange} placeholder="Juan García" />
              </div>
              <div className="form-group">
                <label>Email del cliente</label>
                <input name="userEmail" value={formData.userEmail || ''} onChange={handleFormChange} placeholder="cliente@email.com" />
              </div>
              <div className="modal-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input type="date" name="date" value={formData.date || ''} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>Hora *</label>
                  <select name="time" value={formData.time || ''} onChange={handleFormChange}>
                    <option value="">Seleccionar</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Servicio *</label>
                <select name="serviceId" value={formData.serviceId || ''} onChange={handleFormChange}>
                  {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price.toLocaleString()}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="status" value={formData.status || 'confirmed'} onChange={handleFormChange}>
                  <option value="confirmed">Confirmado</option>
                  <option value="pending">Pendiente</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave}>
                {modal.mode === 'create' ? 'Crear turno' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
