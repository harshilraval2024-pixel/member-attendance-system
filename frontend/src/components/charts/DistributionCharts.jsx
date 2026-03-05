import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = [
  '#0d9488', '#38bdf8', '#14b8a6', '#7dd3fc', '#0ea5e9',
  '#0f766e', '#06b6d4', '#10b981', '#22d3ee', '#2dd4bf',
];

const SkillsDistributionChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="chart-card h-100">
      <div className="card-header">
        <h6><span className="chart-dot chart-dot-teal"></span> Skills Distribution</h6>
      </div>
      <div className="card-body">
        {chartData.length === 0 ? (
          <p className="text-muted text-center py-4">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" name="Members">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const StatusDistributionChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item._id === 'studying' ? 'Studying' : 'Working',
    value: item.count,
  }));

  return (
    <div className="chart-card h-100">
      <div className="card-header">
        <h6><span className="chart-dot chart-dot-blue"></span> Study vs Job Distribution</h6>
      </div>
      <div className="card-body">
        {chartData.length === 0 ? (
          <p className="text-muted text-center py-4">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export { SkillsDistributionChart, StatusDistributionChart };
