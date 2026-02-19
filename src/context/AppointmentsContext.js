import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const AppointmentsContext = createContext(null);

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

export const SERVICES = [
  { id: 'corte', name: 'Corte de Cabello', duration: 30, price: 2500 },
  { id: 'barba', name: 'Arreglo de Barba', duration: 30, price: 1800 },
  { id: 'combo', name: 'Corte + Barba', duration: 60, price: 3800 },
  { id: 'cejas', name: 'Perfilado de Cejas', duration: 15, price: 800 },
];

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = useCallback(async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });
    if (!error && data) {
      // Normalize snake_case to camelCase
      setAppointments(data.map(a => ({
        id: a.id,
        userId: a.user_id,
        userName: a.user_name,
        userEmail: a.user_email,
        date: a.date,
        time: a.time,
        serviceId: a.service_id,
        serviceName: a.service_name,
        price: a.price,
        status: a.status,
        createdAt: a.created_at,
      })));
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    // Suscripción en tiempo real
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [fetchAppointments]);

  const getSlotAvailability = (date, time) => {
    return !appointments.find(a => a.date === date && a.time === time && a.status !== 'cancelled');
  };

  const createAppointment = async (appt) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        user_id: appt.userId,
        user_name: appt.userName,
        user_email: appt.userEmail,
        date: appt.date,
        time: appt.time,
        service_id: appt.serviceId,
        service_name: appt.serviceName,
        price: appt.price,
        status: appt.status || 'confirmed',
      }])
      .select()
      .single();

    if (error) { console.error(error); return null; }
    await fetchAppointments();
    return { ...appt, id: data.id };
  };

  const updateAppointment = async (id, updates) => {
    const dbUpdates = {};
    if (updates.userName !== undefined) dbUpdates.user_name = updates.userName;
    if (updates.userEmail !== undefined) dbUpdates.user_email = updates.userEmail;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (updates.serviceId !== undefined) dbUpdates.service_id = updates.serviceId;
    if (updates.serviceName !== undefined) dbUpdates.service_name = updates.serviceName;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    await supabase.from('appointments').update(dbUpdates).eq('id', id);
    await fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    await supabase.from('appointments').delete().eq('id', id);
    await fetchAppointments();
  };

  const getAppointmentsByDate = (date) => {
    return appointments.filter(a => a.date === date && a.status !== 'cancelled');
  };

  const getUserAppointments = (userId) => {
    return appointments.filter(a => a.userId === userId);
  };

  return (
    <AppointmentsContext.Provider value={{
      appointments,
      fetchAppointments,
      getSlotAvailability,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointmentsByDate,
      getUserAppointments,
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export const useAppointments = () => useContext(AppointmentsContext);
