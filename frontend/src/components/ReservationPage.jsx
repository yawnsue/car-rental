import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/black-rock-logo.png";

function ReservationPage() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Orlando, FL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleId}`);
        const data = await response.json();

        if (!response.ok) {
          setPageError(data.message || "Vehicle not found.");
          setVehicle(null);
          return;
        }

        setVehicle(data);
      } catch (err) {
        console.error("Error fetching reservation vehicle:", err);
        setPageError("Unable to load vehicle.");
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const getDaysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const saveReservationLocally = (reservation) => {
    const existingReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];
    existingReservations.push(reservation);
    localStorage.setItem("reservations", JSON.stringify(existingReservations));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!pickupDate || !returnDate || !pickupLocation.trim()) {
      setError("Please complete all reservation fields.");
      return;
    }

    const days = getDaysBetween(pickupDate, returnDate);

    if (days <= 0) {
      setError("Return date must be after pickup date.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const userId = user?._id || user?.id;
    const vehicleDbId = vehicle?._id || vehicle?.id;

    if (!user || !userId) {
      setError("You must be logged in to create a reservation.");
      return;
    }

    if (!vehicle || !vehicleDbId) {
      setError("Vehicle information is unavailable.");
      return;
    }

    const totalPrice = Number(vehicle.dailyRate) * days;

    const localReservation = {
      _id: `local-${Date.now()}`,
      user: userId,
      vehicle: vehicleDbId,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      pickupDate,
      returnDate,
      pickupLocation,
      totalPrice,
      status: "Upcoming",
      dateRange: `${pickupDate} - ${returnDate}`,
      imageClass: "trip-image",
      canCancel: true,
    };

    saveReservationLocally(localReservation);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          user: userId,
          vehicle: vehicleDbId,
          startDate: pickupDate,
          endDate: returnDate,
          totalPrice,
          status: "Upcoming",
        }),
      });

      if (!response.ok) {
        setSuccess("Reservation saved locally for demo.");
        setTimeout(() => navigate("/reservations"), 1200);
        return;
      }

      setSuccess("Reservation created successfully.");
      setTimeout(() => navigate("/reservations"), 1200);
    } catch (err) {
      console.error("Reservation create error:", err);
      setSuccess("Reservation saved locally for demo.");
      setTimeout(() => navigate("/reservations"), 1200);
    }
  };

  const renderVehicleImage = () => {
    if (vehicle?.imageUrl && vehicle.imageUrl.trim() !== "") {
      return (
        <div
          className="reservation-vehicle-image"
          style={{
            background: `linear-gradient(rgba(10, 10, 10, 0.22), rgba(10, 10, 10, 0.28)), url("${vehicle.imageUrl}") center/cover no-repeat`,
          }}
        />
      );
    }

    return <div className="reservation-vehicle-image trip-image"></div>;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="sidebar-top">
              <div className="sidebar-brand">
                <img src={logo} alt="Black Rock Solutions logo" className="sidebar-logo" />
                <div className="sidebar-brand-copy">
                  <h1>Black Rock Solutions</h1>
                </div>
              </div>
            </div>
          </aside>

          <main className="dashboard-main">
            <section className="dashboard-card trips-panel">
              <div className="empty-state">
                <h3>Loading reservation details...</h3>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="sidebar-top">
              <div className="sidebar-brand">
                <img src={logo} alt="Black Rock Solutions logo" className="sidebar-logo" />
                <div className="sidebar-brand-copy">
                  <h1>Black Rock Solutions</h1>
                </div>
              </div>

              <nav className="sidebar-nav">
                <button className="sidebar-nav-item" onClick={() => navigate("/browse")}>
                  Dashboard
                </button>
                <button className="sidebar-nav-item" onClick={() => navigate("/trips")}>
                  My Trips
                </button>
                <button className="sidebar-nav-item" onClick={() => navigate("/vehicles")}>
                  Browse Vehicles
                </button>
                <button className="sidebar-nav-item" onClick={() => navigate("/reservations")}>
                  Reservations
                </button>
                <button className="sidebar-nav-item" onClick={() => navigate("/account")}>
                  Account
                </button>
              </nav>
            </div>

            <div className="sidebar-bottom">
              <button className="btn btn-secondary dashboard-btn-sm" onClick={() => navigate("/")}>
                Logout
              </button>
            </div>
          </aside>

          <main className="dashboard-main">
            <section className="dashboard-card trips-panel">
              <div className="empty-state">
                <h3>Vehicle not found.</h3>
                <p>{pageError || "Select a valid vehicle before creating a reservation."}</p>
                <div className="empty-state-actions">
                  <button
                    className="btn btn-primary dashboard-btn-sm"
                    onClick={() => navigate("/vehicles")}
                  >
                    Back to Vehicles
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  const estimatedDays =
    pickupDate && returnDate && getDaysBetween(pickupDate, returnDate) > 0
      ? getDaysBetween(pickupDate, returnDate)
      : 3;

  const estimatedTotal = Number(vehicle.dailyRate) * estimatedDays;

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <img src={logo} alt="Black Rock Solutions logo" className="sidebar-logo" />
              <div className="sidebar-brand-copy">
                <h1>Black Rock Solutions</h1>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button className="sidebar-nav-item" onClick={() => navigate("/browse")}>
                Dashboard
              </button>
              <button className="sidebar-nav-item" onClick={() => navigate("/trips")}>
                My Trips
              </button>
              <button className="sidebar-nav-item" onClick={() => navigate("/vehicles")}>
                Browse Vehicles
              </button>
              <button className="sidebar-nav-item active" onClick={() => navigate("/reservations")}>
                Reservations
              </button>
              <button className="sidebar-nav-item" onClick={() => navigate("/account")}>
                Account
              </button>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <button className="btn btn-secondary dashboard-btn-sm" onClick={() => navigate("/")}>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-card dashboard-topbar">
            <div className="dashboard-topbar-copy">
              <h2>Reservation Details</h2>
              <p>Complete your booking information for this vehicle.</p>
            </div>

            <div className="dashboard-topbar-actions">
              <button
                className="btn btn-secondary dashboard-btn-sm"
                onClick={() => navigate(`/vehicles/${vehicle._id || vehicle.id}`)}
              >
                Back to Vehicle
              </button>
            </div>
          </section>

          <section className="reservation-layout">
            <article className="dashboard-card reservation-main">
              {renderVehicleImage()}

              <div className="reservation-main-content">
                <div className="reservation-vehicle-header">
                  <div>
                    <p className="vehicle-details-label">Selected Vehicle</p>
                    <h3 className="reservation-vehicle-title">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="reservation-vehicle-type">
                      {vehicle.type || "Vehicle"}
                    </p>
                  </div>

                  <div className="reservation-price-box">
                    <span>${vehicle.dailyRate}</span>
                    <small>/day</small>
                  </div>
                </div>

                <div className="vehicle-features">
                  {Array.isArray(vehicle.features) && vehicle.features.length > 0 ? (
                    vehicle.features.map((feature, index) => (
                      <span className="vehicle-feature-tag" key={index}>
                        {typeof feature === "string" ? feature : feature.name}
                      </span>
                    ))
                  ) : (
                    <span className="vehicle-feature-tag">Standard Rental</span>
                  )}
                </div>

                <form className="reservation-form" onSubmit={handleReservationSubmit}>
                  <div className="reservation-form-grid">
                    <div className="reservation-field">
                      <label className="label" htmlFor="pickupDate">
                        Pickup Date
                      </label>
                      <input
                        id="pickupDate"
                        type="date"
                        className="input-field"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>

                    <div className="reservation-field">
                      <label className="label" htmlFor="returnDate">
                        Return Date
                      </label>
                      <input
                        id="returnDate"
                        type="date"
                        className="input-field"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="reservation-field">
                    <label className="label" htmlFor="pickupLocation">
                      Pickup Location
                    </label>
                    <input
                      id="pickupLocation"
                      type="text"
                      className="input-field"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                    />
                  </div>

                  {error && <div className="reservation-message reservation-error">{error}</div>}
                  {success && <div className="reservation-message reservation-success">{success}</div>}

                  <div className="reservation-actions">
                    <button type="submit" className="btn btn-primary dashboard-btn-sm">
                      Confirm Reservation
                    </button>
                  </div>
                </form>
              </div>
            </article>

            <aside className="dashboard-card reservation-side">
              <div className="reservation-summary-section">
                <p className="vehicle-details-label">Pricing Summary</p>
                <div className="reservation-summary-row">
                  <span>Vehicle Rate</span>
                  <strong>${vehicle.dailyRate}/day</strong>
                </div>
                <div className="reservation-summary-row">
                  <span>Estimated Duration</span>
                  <strong>{estimatedDays} day(s)</strong>
                </div>
                <div className="reservation-summary-row reservation-summary-total">
                  <span>Estimated Total</span>
                  <strong>${estimatedTotal}</strong>
                </div>
              </div>

              <div className="reservation-summary-section">
                <p className="vehicle-details-label">Reservation Notes</p>
                <p className="reservation-note">
                  Reservations are saved locally for the frontend flow and also attempt backend persistence.
                </p>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ReservationPage;