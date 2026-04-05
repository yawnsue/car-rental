import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/black-rock-logo.png";

function BrowseVehiclesPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vehicles");
        const data = await response.json();

        if (!response.ok) {
          setPageError(data.message || "Failed to load vehicles.");
          setVehicles([]);
          return;
        }

        setVehicles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setPageError("Unable to load vehicles.");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const renderVehicleImage = (vehicle) => {
    if (vehicle.imageUrl && vehicle.imageUrl.trim() !== "") {
      return (
        <div
          className="trip-image"
          style={{
            background: `linear-gradient(rgba(10, 10, 10, 0.22), rgba(10, 10, 10, 0.28)), url("${vehicle.imageUrl}") center/cover no-repeat`,
          }}
        />
      );
    }

    return <div className="trip-image"></div>;
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-top">
            <div className="sidebar-brand">
              <img
                src={logo}
                alt="Black Rock Solutions logo"
                className="sidebar-logo"
              />
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
              <button className="sidebar-nav-item active" onClick={() => navigate("/vehicles")}>
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
            <button
              className="btn btn-secondary dashboard-btn-sm"
              onClick={() => navigate("/")}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-card dashboard-topbar">
            <div className="dashboard-topbar-copy">
              <h2>Browse Vehicles</h2>
              <p>Explore available rentals and find the right vehicle for your next trip.</p>
            </div>
          </section>

          <section className="dashboard-card trips-panel">
            <div className="trips-panel-header">
              <div className="trips-panel-copy">
                <h3>Available Fleet</h3>
                <p>Browse the current Black Rock Solutions rental selection.</p>
              </div>
            </div>

            {pageError && (
              <div className="reservation-message reservation-error">
                {pageError}
              </div>
            )}

            {loading ? (
              <div className="empty-state">
                <h3>Loading vehicles...</h3>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="empty-state">
                <h3>No vehicles available.</h3>
                <p>Add vehicles in the admin dashboard to populate the fleet.</p>
              </div>
            ) : (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => {
                  const vehicleId = vehicle._id || vehicle.id;

                  return (
                    <article className="vehicle-card" key={vehicleId}>
                      {renderVehicleImage(vehicle)}

                      <div className="vehicle-card-body">
                        <div className="vehicle-card-top">
                          <div>
                            <h4 className="vehicle-title">
                              {vehicle.make} {vehicle.model}
                            </h4>
                            <p className="vehicle-type">
                              {vehicle.type || "Vehicle"}
                            </p>
                          </div>

                          <div className="vehicle-price">
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

                        <div className="vehicle-card-actions">
                          <button
                            className="btn btn-secondary dashboard-btn-sm"
                            onClick={() => navigate(`/vehicles/${vehicleId}`)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-primary dashboard-btn-sm"
                            onClick={() => navigate(`/reservations/${vehicleId}`)}
                          >
                            Reserve Now
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default BrowseVehiclesPage;