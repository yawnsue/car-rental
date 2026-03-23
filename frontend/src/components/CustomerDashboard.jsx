import React, { useState, useEffect } from 'react';

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/my-bookings');
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, { method: 'DELETE' });
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert('Booking cancelled.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>My Turo Trips</h2>
      {bookings.length === 0 ? <p>No upcoming trips.</p> : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <p>Total: ${booking.totalPrice}</p>
              <button onClick={() => handleCancelBooking(booking._id)}>Cancel Trip</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default CustomerDashboard;