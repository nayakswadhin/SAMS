import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EventList } from './components/EventList';
import { BookingForm } from './components/BookingForm';
import type { Event } from './types';

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Annual Cultural Night',
    date: '2024-03-25',
    time: '18:00',
    balconySeats: 100,
    ordinarySeats: 200,
    balconyPrice: 500,
    ordinaryPrice: 300,
  },
  {
    id: '2',
    name: 'Classical Music Concert',
    date: '2024-03-28',
    time: '19:00',
    balconySeats: 80,
    ordinarySeats: 150,
    balconyPrice: 400,
    ordinaryPrice: 250,
  },
];

function App() {
  const [currentView, setCurrentView] = useState('events');
  const [userRole, setUserRole] = useState<'manager' | 'salesperson' | 'spectator'>('spectator');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBookingSubmit = (booking: any) => {
    console.log('Booking submitted:', booking);
    setSelectedEvent(null);
    // Here you would typically make an API call to save the booking
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setCurrentView={setCurrentView} userRole={userRole} />
      
      <main className="container mx-auto p-4">
        {currentView === 'login' && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setUserRole('manager')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Login as Manager
            </button>
            <button
              onClick={() => setUserRole('salesperson')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Login as Salesperson
            </button>
            <button
              onClick={() => setUserRole('spectator')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Continue as Spectator
            </button>
          </div>
        )}

        {currentView === 'events' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <EventList
              events={mockEvents}
              onBookEvent={userRole !== 'manager' ? handleBookEvent : undefined}
              onEditEvent={userRole === 'manager' ? (event) => console.log('Edit event:', event) : undefined}
            />
          </>
        )}

        {selectedEvent && (
          <BookingForm
            event={selectedEvent}
            onSubmit={handleBookingSubmit}
            onCancel={() => setSelectedEvent(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;