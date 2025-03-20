export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  balconySeats: number;
  ordinarySeats: number;
  balconyPrice: number;
  ordinaryPrice: number;
}

export interface Booking {
  id: string;
  eventId: string;
  seatType: 'balcony' | 'ordinary';
  seatNumber: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}