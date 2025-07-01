import React, { useState } from "react";

function AddMediator() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    mediator_email: "",
    mediator_phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mediator submitted:", formData);
    // TODO: send formData to your backend via fetch or axios
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">Add New Mediator</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Middle Name</label>
          <input
            type="text"
            name="middle_name"
            className="form-control"
            value={formData.middle_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mediator Email</label>
          <input
            type="email"
            name="mediator_email"
            className="form-control"
            value={formData.mediator_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="mediator_phone_number"
            className="form-control"
            value={formData.mediator_phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100 fw-semibold">
          Submit Mediator
        </button>
      </form>
    </div>
  );
}

export default AddMediator;
