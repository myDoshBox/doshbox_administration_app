import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMediators } from '../../Redux/Slice/MediatorSlice/mediatorSlice';
import dayjs from 'dayjs';

function GetAllMediators() {
  const dispatch = useDispatch();
  const { list: mediators, loading, error } = useSelector((state) => state.mediator);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // 🔁 Fetch on mount & every 10 seconds
  useEffect(() => {
    dispatch(fetchAllMediators());

    const interval = setInterval(() => {
      dispatch(fetchAllMediators());
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // Sort newest first
  const sortedMediators = [...mediators].sort(
    (a, b) => new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at)
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentMediators = sortedMediators.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedMediators.length / rowsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">All Mediators</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
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
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center text-secondary py-4">
                  Loading mediators...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center text-danger py-4">
                  {error}
                </td>
              </tr>
            ) : currentMediators.length > 0 ? (
              currentMediators.map((m, index) => (
                <tr key={index}>
                  <td className="text-center">{indexOfFirst + index + 1}</td>
                  <td>{`${m.first_name} ${m.middle_name} ${m.last_name}`}</td>
                  <td>{m.mediator_email}</td>
                  <td>••••••••</td>
                  <td>{dayjs(m.timestamp || m.created_at).format('YYYY-MM-DD HH:mm')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  <div>
                    <i className="bi bi-person-dash" style={{ fontSize: '1.5rem' }}></i>
                    <p className="mb-0 mt-2">No mediators found yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default GetAllMediators;
