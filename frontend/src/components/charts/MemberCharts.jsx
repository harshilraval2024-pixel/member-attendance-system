import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { formatDate } from '../../utils/helpers';

const AttendanceHistoryChart = ({ data }) => {
  const chartData = [...data].reverse().map((item) => ({
    date: formatDate(item.date),
    value: item.status === 'present' ? 1 : 0,
    label: item.status === 'present' ? 'Present' : 'Absent',
  }));

  return (
    <div className="chart-card h-100">
      <div className="card-header">
        <h6><span className="chart-dot chart-dot-teal"></span> Attendance History</h6>
      </div>
      <div className="card-body">
        {chartData.length === 0 ? (
          <p className="text-muted text-center py-4">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(v) => (v === 1 ? 'Present' : 'Absent')}
              />
              <Tooltip
                formatter={(value) => (value === 1 ? 'Present' : 'Absent')}
              />
              <Bar
                dataKey="value"
                name="Status"
                fill="#0d9488"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const WeeklyParticipationChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: `W${item._id.week}`,
    present: item.present,
    absent: item.absent,
  }));

  return (
    <div className="chart-card h-100">
      <div className="card-header">
        <h6><span className="chart-dot chart-dot-blue"></span> Weekly Participation</h6>
      </div>
      <div className="card-body">
        {chartData.length === 0 ? (
          <p className="text-muted text-center py-4">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#0d9488" name="Present" strokeWidth={2} dot={{ fill: '#0d9488' }} />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export { AttendanceHistoryChart, WeeklyParticipationChart };
