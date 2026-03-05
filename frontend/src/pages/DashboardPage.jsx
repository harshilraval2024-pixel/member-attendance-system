import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faClipboardList,
  faChartLine,
  faTrophy,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { dashboardStore } from '../stores';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { WeeklyTrendChart, MonthlyTrendChart } from '../components/charts/AttendanceCharts';
import { SkillsDistributionChart, StatusDistributionChart } from '../components/charts/DistributionCharts';

const DashboardPage = observer(() => {
  useEffect(() => {
    dashboardStore.fetchDashboardStats();
  }, []);

  if (dashboardStore.loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="container-fluid py-4">
      <div className="page-header">
        <h2>
          <span className="header-icon header-icon-teal">
            <FontAwesomeIcon icon={faChartLine} />
          </span>
          Dashboard
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard
            title="Total Members"
            value={dashboardStore.totalMembers}
            icon={faUsers}
            color="primary"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Attendance Records"
            value={dashboardStore.totalAttendance}
            icon={faClipboardList}
            color="success"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Avg Attendance Rate"
            value={`${dashboardStore.avgAttendanceRate}%`}
            icon={faChartLine}
            color="warning"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            title="Most Active"
            value={dashboardStore.mostActive?.[0]
              ? `${dashboardStore.mostActive[0].firstName} ${dashboardStore.mostActive[0].surname}`
              : 'N/A'}
            icon={faTrophy}
            color="danger"
            subtitle={dashboardStore.mostActive?.[0]
              ? `${dashboardStore.mostActive[0].presentDays} days`
              : ''}
          />
        </div>
      </div>

      {/* Top Active Members */}
      {dashboardStore.mostActive.length > 0 && (
        <div className="card shadow-sm mb-4" style={{ borderRadius: '14px', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <div className="card-header" style={{ background: 'transparent', borderBottom: '1px solid var(--gray-100)' }}>
            <h6 className="mb-0" style={{ color: 'var(--gray-700)', fontWeight: 600 }}>
              <FontAwesomeIcon icon={faStar} className="me-2" style={{ color: 'var(--warning)' }} />
              Most Active Members
            </h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 table-custom">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Present Days</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardStore.mostActive.map((m, i) => (
                    <tr key={m._id}>
                      <td>
                        <span className={`badge ${i === 0 ? 'badge-warning' : i === 1 ? 'badge-blue' : 'badge-teal'}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{m.firstName} {m.surname}</td>
                      <td>
                        <span className="badge badge-success">{m.presentDays}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 - Attendance Trends */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <WeeklyTrendChart data={dashboardStore.weeklyTrend} />
        </div>
        <div className="col-md-6">
          <MonthlyTrendChart data={dashboardStore.monthlyTrend} />
        </div>
      </div>

      {/* Charts Row 2 - Distributions */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <SkillsDistributionChart data={dashboardStore.skillsDistribution} />
        </div>
        <div className="col-md-5">
          <StatusDistributionChart data={dashboardStore.statusDistribution} />
        </div>
      </div>

      {dashboardStore.error && (
        <div className="alert alert-danger">{dashboardStore.error}</div>
      )}
    </div>
  );
});

export default DashboardPage;
