import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardCheck,
  faHistory,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { attendanceStore } from '../stores';
import AttendanceForm from '../components/forms/AttendanceForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { formatDate, getStatusBadgeClass } from '../utils/helpers';
import { showSuccess, showError } from '../utils/swal';

const AttendancePage = observer(() => {
  useEffect(() => {
    attendanceStore.fetchAttendance();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await attendanceStore.createAttendance(values);
      showSuccess('Recorded!', 'Attendance has been saved.');
      attendanceStore.fetchAttendance();
    } catch (err) {
      showError('Error', attendanceStore.error || 'Failed to record attendance');
    }
  };

  const handlePageChange = (page) => {
    attendanceStore.setPage(page);
    attendanceStore.fetchAttendance({ page });
  };

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <h2>
          <span className="header-icon header-icon-blue">
            <FontAwesomeIcon icon={faClipboardCheck} />
          </span>
          Attendance Management
        </h2>
      </div>

      {/* Attendance Form */}
      <div className="mb-4">
        <AttendanceForm onSubmit={handleSubmit} />
      </div>

      {/* Error Display */}
      {attendanceStore.error && (
        <div className="alert alert-danger alert-dismissible">
          {attendanceStore.error}
          <button
            type="button"
            className="btn-close"
            onClick={() => attendanceStore.clearError()}
          />
        </div>
      )}

      {/* Attendance Records */}
      <div className="card" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <div className="card-header" style={{ background: 'transparent', borderBottom: '1px solid var(--gray-100)' }}>
          <h5 className="mb-0" style={{ color: 'var(--gray-700)', fontWeight: 600 }}>
            <FontAwesomeIcon icon={faHistory} className="me-2" style={{ color: 'var(--teal)' }} />
            Attendance Records
          </h5>
        </div>
        {attendanceStore.loading ? (
          <div className="card-body">
            <LoadingSpinner message="Loading records..." />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover mb-0 table-custom">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Member</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Recorded At</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceStore.records.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendanceStore.records.map((record, index) => (
                      <tr key={record._id}>
                        <td>
                          {(attendanceStore.pagination.page - 1) * attendanceStore.pagination.limit + index + 1}
                        </td>
                        <td>
                          {record.memberId
                            ? `${record.memberId.firstName} ${record.memberId.surname}`
                            : 'Unknown'}
                        </td>
                        <td>{formatDate(record.date)}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                            <FontAwesomeIcon
                              icon={record.status === 'present' ? faCheckCircle : faTimesCircle}
                              className="me-1"
                            />
                            {record.status}
                          </span>
                        </td>
                        <td>{formatDate(record.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <Pagination
                pagination={attendanceStore.pagination}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default AttendancePage;
