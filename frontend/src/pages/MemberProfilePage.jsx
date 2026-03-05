import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faArrowLeft,
  faEdit,
  faCalendarAlt,
  faMapMarkerAlt,
  faBriefcase,
  faGraduationCap,
  faTools,
  faHeart,
  faCheckCircle,
  faTimesCircle,
  faPercentage,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { dashboardStore } from '../stores';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/common/StatCard';
import { AttendanceHistoryChart, WeeklyParticipationChart } from '../components/charts/MemberCharts';
import { formatDate, getMemberStatusBadge } from '../utils/helpers';

const MemberProfilePage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dashboardStore.fetchMemberStats(id);
    return () => dashboardStore.clearMemberStats();
  }, [id]);

  if (dashboardStore.loading || !dashboardStore.memberStats) {
    return <LoadingSpinner message="Loading member profile..." />;
  }

  const { member, stats, weeklyParticipation, attendanceHistory } = dashboardStore.memberStats;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="page-header">
        <h2>
          <span className="header-icon header-icon-teal">
            <FontAwesomeIcon icon={faUser} />
          </span>
          Member Profile
        </h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)} style={{ borderRadius: '8px' }}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </button>
          <Link to={`/members/${id}/edit`} className="btn btn-primary" style={{ borderRadius: '8px' }}>
            <FontAwesomeIcon icon={faEdit} className="me-1" />
            Edit
          </Link>
        </div>
      </div>

      {/* Member Info */}
      <div className="card mb-4" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <div className="card-header card-header-teal">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            {member.firstName} {member.surname}
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted fw-bold" style={{ width: '40%' }}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />Full Name
                    </td>
                    <td>{member.firstName} {member.surname}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-bold">
                      <FontAwesomeIcon icon={faUser} className="me-2" />Father Name
                    </td>
                    <td>{member.fatherName}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-bold">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Date of Birth
                    </td>
                    <td>{formatDate(member.dob)}</td>
                  </tr>
                  <tr>
                    <td className="text-muted fw-bold">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Address
                    </td>
                    <td>{member.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted fw-bold" style={{ width: '40%' }}>
                      <FontAwesomeIcon icon={faBriefcase} className="me-2" />Status
                    </td>
                    <td>
                      <span className={`badge ${getMemberStatusBadge(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                  {member.status === 'studying' && (
                    <tr>
                      <td className="text-muted fw-bold">
                        <FontAwesomeIcon icon={faGraduationCap} className="me-2" />Field of Study
                      </td>
                      <td>{member.studyField}</td>
                    </tr>
                  )}
                  {member.status === 'working' && (
                    <>
                      <tr>
                        <td className="text-muted fw-bold">
                          <FontAwesomeIcon icon={faBriefcase} className="me-2" />Job Title
                        </td>
                        <td>{member.jobTitle}</td>
                      </tr>
                      <tr>
                        <td className="text-muted fw-bold">
                          <FontAwesomeIcon icon={faBriefcase} className="me-2" />Company
                        </td>
                        <td>{member.company}</td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td className="text-muted fw-bold">
                      <FontAwesomeIcon icon={faBriefcase} className="me-2" />Occupation
                    </td>
                    <td>{member.occupation || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="row mt-3">
            <div className="col-md-6">
              <h6>
                <FontAwesomeIcon icon={faTools} className="me-2" style={{ color: 'var(--teal)' }} />
                Skills
              </h6>
              <div className="d-flex flex-wrap gap-1">
                {(member.skills || []).length > 0 ? (
                  member.skills.map((skill, i) => (
                    <span key={i} className="badge badge-skill">{skill}</span>
                  ))
                ) : (
                  <span className="text-muted">No skills listed</span>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <h6>
                <FontAwesomeIcon icon={faHeart} className="me-2" style={{ color: 'var(--light-blue)' }} />
                Interests
              </h6>
              <div className="d-flex flex-wrap gap-1">
                {(member.interests || []).length > 0 ? (
                  member.interests.map((interest, i) => (
                    <span key={i} className="badge badge-interest">{interest}</span>
                  ))
                ) : (
                  <span className="text-muted">No interests listed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Present Days"
            value={stats.presentDays}
            icon={faCheckCircle}
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Absent Days"
            value={stats.absentDays}
            icon={faTimesCircle}
            color="danger"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Attendance %"
            value={`${stats.efficiency}%`}
            icon={faPercentage}
            color="info"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Efficiency Score"
            value={stats.efficiency >= 75 ? 'Excellent' : stats.efficiency >= 50 ? 'Good' : 'Needs Improvement'}
            icon={faBolt}
            color={stats.efficiency >= 75 ? 'success' : stats.efficiency >= 50 ? 'warning' : 'danger'}
            subtitle={`${stats.efficiency}%`}
          />
        </div>
      </div>

      {/* Attendance Charts */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <AttendanceHistoryChart data={attendanceHistory} />
        </div>
        <div className="col-md-6">
          <WeeklyParticipationChart data={weeklyParticipation} />
        </div>
      </div>

      {dashboardStore.error && (
        <div className="alert alert-danger">{dashboardStore.error}</div>
      )}
    </div>
  );
});

export default MemberProfilePage;
