import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMediator } from '../../Redux/Slice/MediatorSlice/mediatorSlice';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(addMediator(formData));
      const payload = resultAction.payload;

      if (resultAction.meta.requestStatus === 'fulfilled') {
        toast.success('User added successfully');
        setTimeout(() => navigate(''), 1500);
      } else {
        const errorMessage = typeof payload === 'object' && payload?.message
          ? payload.message
          : 'Failed to add mediator';
      
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <Toaster position="top-right" />
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="mb-4 text-center fw-bold">Add New Mediator</h2>
        <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="middle_name" className="form-label">Middle Name</label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              className="form-control"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mediator_email" className="form-label">Email</label>
            <input
              type="email"
              id="mediator_email"
              name="mediator_email"
              className="form-control"
              value={formData.mediator_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mediator_phone_number" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="mediator_phone_number"
              name="mediator_phone_number"
              className="form-control"
              value={formData.mediator_phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Add Mediator
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMediator;
