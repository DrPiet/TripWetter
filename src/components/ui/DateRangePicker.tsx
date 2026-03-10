'use client';

import { formatDate, todayDate } from '@/lib/utils/dateUtils';

interface Props {
  arrivalDate: string;
  departureDate: string;
  onChange: (arrival: string, departure: string) => void;
}

const today = formatDate(todayDate());

export function DateRangePicker({ arrivalDate, departureDate, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Ankunft</label>
        <input
          type="date"
          value={arrivalDate}
          onChange={(e) => {
            const newArrival = e.target.value;
            const newDeparture = newArrival > departureDate ? newArrival : departureDate;
            onChange(newArrival, newDeparture);
          }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Abreise</label>
        <input
          type="date"
          value={departureDate}
          min={arrivalDate || today}
          onChange={(e) => onChange(arrivalDate, e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
