import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  setCurrentView: (view: string) => void;
  userRole: 'manager' | 'salesperson' | 'spectator';
}

export function Navbar({ setCurrentView, userRole }: NavbarProps) {
  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">SAMS</h1>
        <div className="flex gap-4">
          {userRole === 'manager' && (
            <>
              <button onClick={() => setCurrentView('events')} className="hover:text-indigo-200">
                Events
              </button>
              <button onClick={() => setCurrentView('salespeople')} className="hover:text-indigo-200">
                Salespeople
              </button>
              <button onClick={() => setCurrentView('reports')} className="hover:text-indigo-200">
                Reports
              </button>
            </>
          )}
          {userRole === 'salesperson' && (
            <>
              <button onClick={() => setCurrentView('bookings')} className="hover:text-indigo-200">
                Bookings
              </button>
              <button onClick={() => setCurrentView('sales')} className="hover:text-indigo-200">
                My Sales
              </button>
            </>
          )}
          {userRole === 'spectator' && (
            <>
              <button onClick={() => setCurrentView('events')} className="hover:text-indigo-200">
                Events
              </button>
              <button onClick={() => setCurrentView('myBookings')} className="hover:text-indigo-200">
                My Bookings
              </button>
            </>
          )}
          <button onClick={() => setCurrentView('login')} className="hover:text-indigo-200">
            Switch Role
          </button>
        </div>
      </div>
    </nav>
  );
}