import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMediators } from '../../Redux/Slice/MediatorSlice/mediatorSlice';
import dayjs from 'dayjs';

const MediatorRow = ({ mediator, index, indexOfFirst }) => (
  <tr>
    <td className="text-center">{indexOfFirst + index + 1}</td>
    <td>
      {`${mediator.first_name || ''} ${mediator.middle_name || ''} ${mediator.last_name || ''}`.trim() || '-'}
    </td>
    <td>{mediator.mediator_email || '-'}</td>
    <td>{mediator.mediator_phone_number || '-'}</td>
    <td>
      {mediator.created_at && dayjs(mediator.created_at).isValid()
        ? dayjs(mediator.created_at).format('YYYY-MM-DD HH:mm')
        : '-'}
    </td>
  </tr>
);

function GetAllMediators() {
  const dispatch = useDispatch();
  const { list: mediators, loading, error } = useSelector((state) => state.mediator);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchAllMediators());
    const interval = setInterval(() => {
      dispatch(fetchAllMediators());
    }, 30000); // auto refresh every 30s

    return () => clearInterval(interval);
  }, [dispatch]);

  const totalPages = Math.ceil(mediators.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const sortedMediators = useMemo(() => {
    return [...mediators].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return isNaN(dateB.getTime()) || isNaN(dateA.getTime()) ? 0 : dateB.getTime() - dateA.getTime();
    });
  }, [mediators]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentMediators = sortedMediators.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  const handleRetry = () => dispatch(fetchAllMediators());

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">All Mediators</h2>

      <div className="mb-3 d-flex align-items-center">
        <label htmlFor="rowsPerPage" className="form-label me-2 mb-0">Rows per page:</label>
        <select
          id="rowsPerPage"
          className="form-select w-auto"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          disabled={loading}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center text-danger py-4">
                  <div className="alert alert-danger d-inline-flex align-items-center" role="alert">
                    <span>{error}</span>
                    <button onClick={handleRetry} className="btn btn-sm btn-outline-success ms-3">
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : currentMediators.length > 0 ? (
              currentMediators.map((mediator, index) => (
                <MediatorRow
                  key={mediator.mediator_email || index}
                  mediator={mediator}
                  index={index}
                  indexOfFirst={indexOfFirst}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  <div>
                    <i className="bi bi-person-dash" style={{ fontSize: '1.5rem' }}></i>
                    <p className="mt-2 mb-0">No mediators found yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4" aria-label="Pagination">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
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
