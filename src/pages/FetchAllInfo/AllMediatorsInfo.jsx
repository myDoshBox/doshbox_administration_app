import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMediators } from '../../Redux/Slice/MediatorSlice/mediatorSlice';
import { filterItems } from '../../utils/searchFilter';

const MediatorRow = ({ mediator, index, indexOfFirst }) => {
  const createdAtDate = new Date(mediator.createdAt);
  const formattedDate = isNaN(createdAtDate.getTime()) ? '-' : `${createdAtDate.getFullYear()}-${(createdAtDate.getMonth()+1).toString().padStart(2,'0')}-${createdAtDate.getDate().toString().padStart(2,'0')}`;
  const formattedTime = isNaN(createdAtDate.getTime()) ? '-' : `${createdAtDate.getHours().toString().padStart(2,'0')}:${createdAtDate.getMinutes().toString().padStart(2,'0')}`;

  return (
    <tr>
      <td className="text-center">{indexOfFirst + index + 1}</td>
      <td>
        {`${mediator.first_name || ''} ${mediator.middle_name || ''} ${mediator.last_name || ''}`.trim() || '-'}
      </td>
      <td>{mediator.mediator_email || '-'}</td>
      <td>{mediator.mediator_phone_number || '-'}</td>
      <td>{formattedDate}</td>
      <td>{formattedTime}</td>
    </tr>
  );
};

function GetAllMediators() {
  const dispatch = useDispatch();
  const { list: mediators, loading, error } = useSelector((state) => state.mediator);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchAllMediators());
  }, [dispatch]);

  const totalPages = Math.ceil(mediators.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const sortedMediators = useMemo(() => {
    return [...mediators].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [mediators]);

  const filteredMediators = useMemo(() => {
    return filterItems(sortedMediators, searchQuery, [
      'first_name',
      'middle_name',
      'last_name',
      'mediator_email',
      'mediator_phone_number',
      'createdAt'
    ], {
      fullName: (item) => `${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''}`.trim(),
      createdAt: (item) => {
        const date = new Date(item.createdAt);
        return isNaN(date.getTime()) ? '' : `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
      }
    });
  }, [sortedMediators, searchQuery]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentMediators = filteredMediators.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  const handleRetry = () => dispatch(fetchAllMediators());

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold">All Mediators</h2>

      <div className="row">
        <div className="mb-3 d-flex align-items-center col">
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
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={35}>35</option>
          </select>
        </div>

        <div className="d-flex justify-content-end mb-3 col-8">
          <input
            type="text"
            placeholder="Search by name, email, phone, date..."
            className="form-control w-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date Added</th>
              <th>Time Added</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center text-danger py-4">
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
                  key={mediator._id || index}
                  mediator={mediator}
                  index={index}
                  indexOfFirst={indexOfFirst}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
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