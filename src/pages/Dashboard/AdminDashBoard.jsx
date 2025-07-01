import React from "react";

function AdminDashboard() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "90vh",
        backgroundColor: "rgb(20, 114, 87)",
      }}
    >
      <div
        className="p-5 rounded shadow text-center"
        style={{
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          width: "90%",
        }}
      >
        <h1 className="fw-bold text-dark mb-3">
          Welcome to the Doshbox Admin App
        </h1>
        <p className="text-secondary">
          Manage mediators, track data, and oversee activity with ease.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
