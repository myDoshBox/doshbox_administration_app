import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMediator } from '../../Redux/features/mediator/mediatorSlice';
import { useNavigate } from 'react-router-dom';

function AddMediator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    mediator_email: '',
    mediator_phone_number: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMediator(formData));
    navigate('/get-all-mediators'); // 🔁 Redirect after submission
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">Add New Mediator</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        {Object.entries(formData).map(([key, value]) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key.replace(/_/g, ' ')}</label>
            <input
              type={key === 'mediator_email' ? 'email' : key === 'password' ? 'password' : 'text'}
              className="form-control"
              name={key}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success w-100 fw-semibold">
          Submit Mediator
        </button>
      </form>
    </div>
  );
}

export default AddMediator;
