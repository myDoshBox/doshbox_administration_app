import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMediators } from '../../Redux/Slice/MediatorSlice/mediatorSlice';
import dayjs from 'dayjs';

function GetAllMediators() {
  const dispatch = useDispatch();
  const { list: mediators, loading, error } = useSelector((state) => state.mediator);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchAllMediators());
    const interval = setInterval(() => {
      dispatch(fetchAllMediators());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const totalPages = Math.ceil(mediators.length / rowsPerPage);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const sortedMediators = useMemo(
    () =>
      [...mediators].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ),
    [mediators]
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentMediators = sortedMediators.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">All Mediators</h2>

      {/* Rows per page selector */}
      <div className="mb-3">
        <label htmlFor="rowsPerPage" className="form-label me-2">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          className="form-select w-auto d-inline-block"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle" aria-label="Mediators table">
          <thead className="table-dark text-center">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center text-secondary py-4">
                  Loading mediators...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center text-danger py-4">
                  {error}{' '}
                  <button onClick={() => dispatch(fetchAllMediators())} className="btn btn-sm btn-outline-success ms-2">
                    Retry
                  </button>
                </td>
              </tr>
            ) : currentMediators.length > 0 ? (
              currentMediators.map((m, index) => (
                <tr key={m.id || `${m.mediator_email}-${index}`}>
                  <td className="text-center">{indexOfFirst + index + 1}</td>
                  <td>{`${m.first_name || ''} ${m.middle_name || ''} ${m.last_name || ''}`.trim()}</td>
                  <td>{m.mediator_email || '-'}</td>
                  <td>{dayjs(m.created_at).format('YYYY-MM-DD HH:mm')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  <div>
                    <i className="bi bi-person-dash" style={{ fontSize: '1.5rem' }} aria-hidden="true"></i>
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
        <nav aria-label="Mediators pagination" className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous page">
                Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next page">
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default GetAllMediators;
