import React, { useState } from 'react';
import type { Event } from '../types';

interface BookingFormProps {
  event: Event;
  onSubmit: (booking: any) => void;
  onCancel: () => void;
}

export function BookingForm({ event, onSubmit, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    seatType: 'ordinary',
    customerName: '',
    customerEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      eventId: event.id,
      bookingDate: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Book Tickets - {event.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Seat Type</label>
            <select
              value={formData.seatType}
              onChange={(e) => setFormData({ ...formData, seatType: e.target.value })}
              className="w-full border rounded p-2"
            >
              <option value="ordinary">Ordinary - ₹{event.ordinaryPrice}</option>
              <option value="balcony">Balcony - ₹{event.balconyPrice}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}