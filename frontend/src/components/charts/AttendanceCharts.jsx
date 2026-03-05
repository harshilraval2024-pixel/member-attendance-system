import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getMonthName } from '../../utils/helpers';

const WeeklyTrendChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: `W${item._id.week}`,
    present: item.present,
    absent: item.absent,
  }));

  return (
    <div className="chart-card h-100">
      <div className="card-header">
        <h6><span className="chart-dot chart-dot-teal"></span> Weekly Attendance Trend</h6>
      </div>
      <div className="card-body">
        {chartData.length === 0 ? (
          <p className="text-muted text-center py-4">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#0d9488" name="Present" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const MonthlyTrendChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: `${getMonthName(item._id.month)} ${item._id.year}`,
    present: item.present,
    absent: item.absent,
    total: item.total,
  }));

  return (
    <div className="chart-card h-100">
      <div className="card-header">
        <h6><span className="chart-dot chart-dot-blue"></span> Monthly Attendance Trend</h6>
      </div>
      <div className="card-body">
        {chartData.length === 0 ? (
          <p className="text-muted text-center py-4">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#14b8a6" name="Present" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#f87171" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export { WeeklyTrendChart, MonthlyTrendChart };
