import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/black-rock-logo.png";

function VehicleDetailsPage() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

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
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        setPageError("Unable to load vehicle.");
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const renderVehicleImage = () => {
    if (vehicle?.imageUrl && vehicle.imageUrl.trim() !== "") {
      return (
        <div
          className="vehicle-details-image"
          style={{
            background: `linear-gradient(rgba(10, 10, 10, 0.22), rgba(10, 10, 10, 0.28)), url("${vehicle.imageUrl}") center/cover no-repeat`,
          }}
        />
      );
    }

    return <div className="vehicle-details-image trip-image"></div>;
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
                <h3>Loading vehicle...</h3>
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
            <section className="dashboard-card trips-panel">
              <div className="empty-state">
                <h3>Vehicle not found.</h3>
                <p>{pageError || "The selected vehicle could not be located."}</p>
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

  const vehicleDbId = vehicle._id || vehicle.id;

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
              <h2>
                {vehicle.make} {vehicle.model}
              </h2>
              <p>{vehicle.type || "Vehicle"}</p>
            </div>

            <div className="dashboard-topbar-actions">
              <button
                className="btn btn-secondary dashboard-btn-sm"
                onClick={() => navigate("/vehicles")}
              >
                Back to Vehicles
              </button>
            </div>
          </section>

          <section className="vehicle-details-layout">
            <article className="dashboard-card vehicle-details-main">
              {renderVehicleImage()}

              <div className="vehicle-details-content">
                <div className="vehicle-details-price-row">
                  <div>
                    <p className="vehicle-details-label">Daily Rate</p>
                    <h3 className="vehicle-details-price">${vehicle.dailyRate}/day</h3>
                  </div>

                  <span className="vehicle-details-type-badge">
                    {vehicle.type || "Vehicle"}
                  </span>
                </div>

                <div className="vehicle-details-section">
                  <h4>Vehicle Overview</h4>
                  <p>
                    {vehicle.description ||
                      "This vehicle is available in the current fleet inventory."}
                  </p>
                </div>

                <div className="vehicle-details-section">
                  <h4>Key Features</h4>
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
                </div>
              </div>
            </article>

            <aside className="dashboard-card vehicle-details-side">
              <div className="vehicle-details-side-section">
                <p className="vehicle-details-label">Availability</p>
                <h4>Ready to Reserve</h4>
                <p>
                  This vehicle is available through the live fleet inventory.
                </p>
              </div>

              <div className="vehicle-details-side-section">
                <p className="vehicle-details-label">Rental Notes</p>
                <ul className="vehicle-details-list">
                  <li>Rental is available</li>
                  <li>Flexible trip options</li>
                  <li>Book today</li>
                </ul>
              </div>

              <button
                className="btn btn-primary dashboard-btn-sm"
                onClick={() => navigate(`/reservations/${vehicleDbId}`)}
              >
                Reserve This Vehicle
              </button>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

export default VehicleDetailsPage;