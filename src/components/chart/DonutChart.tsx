import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  height?: number;
}

const COLORS = ['#673ab7', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'];

const DonutChart = ({ data, title, height = 300 }: DonutChartProps) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
