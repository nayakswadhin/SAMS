import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import type { Event } from '../types';

interface EventListProps {
  events: Event[];
  onBookEvent?: (event: Event) => void;
  onEditEvent?: (event: Event) => void;
}

export function EventList({ events, onBookEvent, onEditEvent }: EventListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">{event.name}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Balcony: {event.balconySeats} | Ordinary: {event.ordinarySeats}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Balcony: ₹{event.balconyPrice}</p>
              <p className="text-sm">Ordinary: ₹{event.ordinaryPrice}</p>
            </div>
            {onBookEvent && (
              <button
                onClick={() => onBookEvent(event)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Book Now
              </button>
            )}
            {onEditEvent && (
              <button
                onClick={() => onEditEvent(event)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}