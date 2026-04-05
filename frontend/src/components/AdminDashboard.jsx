import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/black-rock-logo.png";

function AdminDashboard() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    dailyRate: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const authHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "Administrator") {
      navigate("/browse");
      return;
    }

    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setPageError(data.message || "Failed to fetch fleet inventory.");
        setVehicles([]);
        return;
      }

      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setPageError("Error fetching vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (
      !newVehicle.make.trim() ||
      !newVehicle.model.trim() ||
      !String(newVehicle.dailyRate).trim()
    ) {
      setFormError("Please complete make, model, and daily rate.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          make: newVehicle.make,
          model: newVehicle.model,
          dailyRate: Number(newVehicle.dailyRate),
          imageUrl: newVehicle.imageUrl,
          features: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.message || "Failed to add vehicle.");
        return;
      }

      setSuccessMessage("Vehicle added successfully.");
      setNewVehicle({
        make: "",
        model: "",
        dailyRate: "",
        imageUrl: "",
      });
      fetchVehicles();
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setFormError("Unable to add vehicle.");
    }
  };

  const handleDeleteVehicle = async (id) => {
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setPageError(data.message || "Failed to delete vehicle.");
        return;
      }

      setSuccessMessage("Vehicle removed successfully.");
      setVehicles((prev) =>
        prev.filter((vehicle) => (vehicle._id || vehicle.id) !== id)
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setPageError("Unable to delete vehicle.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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
              <button className="sidebar-nav-item active" onClick={() => navigate("/admin")}>
                Admin Dashboard
              </button>
              <button className="sidebar-nav-item" onClick={() => navigate("/browse")}>
                Customer View
              </button>
              <button className="sidebar-nav-item" onClick={() => navigate("/vehicles")}>
                Browse Vehicles
              </button>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <button
              className="btn btn-secondary dashboard-btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-card dashboard-topbar">
            <div className="dashboard-topbar-copy">
              <h2>Administrator Dashboard</h2>
              <p>Manage fleet inventory and maintain available vehicles.</p>
            </div>
          </section>

          <section className="dashboard-card trips-panel">
            <div className="trips-panel-header">
              <div className="trips-panel-copy">
                <h3>Add New Vehicle</h3>
                <p>Create a new fleet entry for the rental inventory.</p>
              </div>
            </div>

            <form onSubmit={handleAddVehicle} className="reservation-form">
              <div className="reservation-form-grid">
                <div className="reservation-field">
                  <label className="label" htmlFor="make">Make</label>
                  <input
                    id="make"
                    className="input-field"
                    type="text"
                    placeholder="Honda"
                    value={newVehicle.make}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, make: e.target.value })
                    }
                  />
                </div>

                <div className="reservation-field">
                  <label className="label" htmlFor="model">Model</label>
                  <input
                    id="model"
                    className="input-field"
                    type="text"
                    placeholder="Pilot"
                    value={newVehicle.model}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, model: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="reservation-form-grid">
                <div className="reservation-field">
                  <label className="label" htmlFor="dailyRate">Daily Rate</label>
                  <input
                    id="dailyRate"
                    className="input-field"
                    type="number"
                    placeholder="85"
                    value={newVehicle.dailyRate}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, dailyRate: e.target.value })
                    }
                  />
                </div>

                <div className="reservation-field">
                  <label className="label" htmlFor="imageUrl">Image URL</label>
                  <input
                    id="imageUrl"
                    className="input-field"
                    type="text"
                    placeholder="Optional image URL"
                    value={newVehicle.imageUrl}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              {formError && (
                <div className="reservation-message reservation-error">
                  {formError}
                </div>
              )}

              {successMessage && (
                <div className="reservation-message reservation-success">
                  {successMessage}
                </div>
              )}

              <div className="reservation-actions">
                <button type="submit" className="btn btn-primary dashboard-btn-sm">
                  Add to Fleet
                </button>
              </div>
            </form>
          </section>

          <section className="dashboard-card trips-panel">
            <div className="trips-panel-header">
              <div className="trips-panel-copy">
                <h3>Current Fleet Inventory</h3>
                <p>View and remove vehicles currently stored in the system.</p>
              </div>
            </div>

            {pageError && (
              <div className="reservation-message reservation-error">
                {pageError}
              </div>
            )}

            {loading ? (
              <div className="empty-state">
                <h3>Loading fleet inventory...</h3>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="empty-state">
                <h3>No vehicles in the database.</h3>
                <p>Add a vehicle above to populate the fleet.</p>
              </div>
            ) : (
              <div className="trips-list">
                {vehicles.map((vehicle) => {
                  const vehicleId = vehicle._id || vehicle.id;

                  return (
                    <article className="trip-card" key={vehicleId}>
                      {renderVehicleImage(vehicle)}

                      <div className="trip-info">
                        <div className="trip-title-row">
                          <h4 className="trip-title">
                            {vehicle.make} {vehicle.model}
                          </h4>
                          <span className="trip-status upcoming">Available</span>
                        </div>

                        <div className="trip-meta">
                          <div className="trip-meta-row">
                            <span className="trip-meta-dot"></span>
                            <span>${vehicle.dailyRate}/day</span>
                          </div>

                          <div className="trip-meta-row">
                            <span className="trip-meta-dot"></span>
                            <span>
                              {vehicle.imageUrl ? "Custom image added" : "No custom image"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="trip-actions">
                        <button
                          className="btn dashboard-btn-sm trip-btn-danger"
                          onClick={() => handleDeleteVehicle(vehicleId)}
                        >
                          Remove
                        </button>
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

export default AdminDashboard;