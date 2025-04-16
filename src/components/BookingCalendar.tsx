import React, { useState } from 'react';
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isWithinInterval,
  isBefore
} from 'date-fns';
import { lt } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  bookedDates: Date[];
  checkIn: Date | null;
  checkOut: Date | null;
  onDateSelect: (date: Date) => void;
}

export function BookingCalendar({
  bookedDates,
  checkIn,
  checkOut,
  onDateSelect
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const allDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const days = allDays.filter(day => !isBefore(day, today));

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return isWithinInterval(date, { start: checkIn, end: checkOut });
  };

  const weekDays = ['P', 'A', 'T', 'K', 'P', 'Š', 'S'];

  const formatCapitalizedMonth = (date: Date) => {
    const raw = format(date, 'LLLL yyyy', { locale: lt });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {formatCapitalizedMonth(currentMonth)}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}

        {days.map(day => {
          const isBooked = isDateBooked(day);
          const isCheckIn = checkIn && isSameDay(day, checkIn);
          const isCheckOut = checkOut && isSameDay(day, checkOut);
          const isInDateRange = isInRange(day);
          const isCurrentDay = isToday(day);

          let className = `
            h-10 rounded-lg flex items-center justify-center text-sm relative
            ${isBooked ? 'bg-red-100 text-red-600 cursor-not-allowed' : 'hover:bg-gray-100'}
            ${isCheckIn ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            ${isCheckOut ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            ${isInDateRange ? 'bg-green-100' : ''}
            ${isCurrentDay ? 'font-bold' : ''}
          `;

          if (isCheckIn) {
            className += ' after:content-["Atvykimas"] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:text-xs after:whitespace-nowrap after:mt-1';
          }
          if (isCheckOut) {
            className += ' after:content-["Išvykimas"] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:text-xs after:whitespace-nowrap after:mt-1';
          }

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isBooked && onDateSelect(day)}
              disabled={isBooked}
              className={className}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded" />
          <span className="text-sm text-gray-600">Užimta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-sm text-gray-600">Pasirinktos datos</span>
        </div>
      </div>
    </div>
  );
}
