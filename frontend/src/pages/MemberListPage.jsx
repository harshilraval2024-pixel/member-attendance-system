import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faFilter,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { memberStore } from '../stores';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { formatDate, getMemberStatusBadge, truncateText } from '../utils/helpers';
import { confirmDelete, showSuccess, showError } from '../utils/swal';

const MemberListPage = observer(() => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const loadMembers = useCallback(
    (params = {}) => {
      memberStore.fetchMembers({
        search,
        status: statusFilter,
        ...params,
      });
    },
    [search, statusFilter]
  );

  useEffect(() => {
    loadMembers();
  }, [statusFilter]); // eslint-disable-line

  // Debounced search
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      memberStore.setPage(1);
      loadMembers();
    }, 400);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line

  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result.isConfirmed) {
      try {
        await memberStore.deleteMember(id);
        showSuccess('Deleted!', `${name} has been removed.`);
      } catch {
        showError('Error', 'Failed to delete member');
      }
    }
  };

  const handlePageChange = (page) => {
    memberStore.setPage(page);
    loadMembers({ page });
  };

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <h2>
          <span className="header-icon header-icon-teal">
            <FontAwesomeIcon icon={faUsers} />
          </span>
          Members
        </h2>
        <Link to="/members/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faUserPlus} className="me-1" />
          Add Member
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="search-bar mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or occupation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    memberStore.setPage(1);
                  }}
                >
                  <option value="">All Status</option>
                  <option value="studying">Studying</option>
                  <option value="working">Working</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <span className="text-muted">
                {memberStore.pagination.total} members found
              </span>
            </div>
          </div>
      </div>

      {/* Members Table */}
      {memberStore.loading ? (
        <LoadingSpinner message="Loading members..." />
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0 table-custom">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Occupation</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberStore.members.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No members found
                    </td>
                  </tr>
                ) : (
                  memberStore.members.map((member, index) => (
                    <tr key={member._id}>
                      <td>
                        {(memberStore.pagination.page - 1) * memberStore.pagination.limit + index + 1}
                      </td>
                      <td>
                        <strong>{member.firstName} {member.surname}</strong>
                      </td>
                      <td>{member.occupation || '-'}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {(member.skills || []).slice(0, 3).map((skill, i) => (
                            <span key={i} className="badge badge-skill small">
                              {skill}
                            </span>
                          ))}
                          {(member.skills || []).length > 3 && (
                            <span className="badge badge-teal small">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getMemberStatusBadge(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td>{formatDate(member.createdAt)}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn-action btn-action-view"
                            title="View Profile"
                            onClick={() => navigate(`/members/${member._id}`)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            className="btn-action"
                            title="Edit"
                            onClick={() => navigate(`/members/${member._id}/edit`)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn-action btn-action-danger"
                            title="Delete"
                            onClick={() => handleDelete(member._id, `${member.firstName} ${member.surname}`)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <Pagination
              pagination={memberStore.pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {memberStore.error && (
        <div className="alert alert-danger mt-3">{memberStore.error}</div>
      )}
    </div>
  );
});

export default MemberListPage;
