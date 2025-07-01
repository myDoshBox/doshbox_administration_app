import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMediators } from '../../Redux/Slice/MediatorSlice/mediatorSlice';

function GetAllMediators() {
  const dispatch = useDispatch();
  const { list: mediators, loading, error } = useSelector((state) => state.mediator);

  useEffect(() => {
    dispatch(fetchAllMediators());
  }, [dispatch]);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">All Mediators</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && !error && (
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
                  <td>{new Date(m.timestamp || m.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GetAllMediators;
