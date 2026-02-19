import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, addMonths, subMonths, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import './Calendar.css';

export default function Calendar({ onSelectDate, selectedDate, appointments = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Días vacíos al inicio (lunes = 0)
  const startDow = (getDay(monthStart) + 6) % 7;

  const getApptCount = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    return appointments.filter(a => a.date === key && a.status !== 'cancelled').length;
  };

  const isPast = (date) => isBefore(startOfDay(date), today);
  const isWeekend = (date) => {
    const dow = getDay(date);
    return dow === 0; // Solo domingo cerrado
  };

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>‹</button>
        <span className="cal-title">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </span>
        <button className="cal-nav" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>›</button>
      </div>

      <div className="cal-weekdays">
        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} className="cal-day empty" />
        ))}
        {days.map(day => {
          const past = isPast(day);
          const weekend = isWeekend(day);
          const disabled = past || weekend;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const count = getApptCount(day);

          return (
            <button
              key={day.toISOString()}
              className={[
                'cal-day',
                disabled ? 'disabled' : 'available',
                isSelected ? 'selected' : '',
                isToday ? 'today' : '',
              ].join(' ')}
              onClick={() => !disabled && onSelectDate(day)}
              disabled={disabled}
            >
              <span className="cal-day-num">{format(day, 'd')}</span>
              {count > 0 && <span className="cal-dot" title={`${count} turno(s)`}>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
