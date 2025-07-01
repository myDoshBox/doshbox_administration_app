import React from 'react';
import { useSelector } from 'react-redux';

function GetAllMediators() {
  const mediators = useSelector((state) => state.mediator.list);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">All Mediators</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {mediators.map((m, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{`${m.first_name} ${m.middle_name} ${m.last_name}`}</td>
                <td>{m.mediator_email}</td>
                <td>{m.password}</td>
                <td>{new Date(m.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetAllMediators;
