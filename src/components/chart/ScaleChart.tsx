import React from 'react';

interface ScaleChartProps {
  title?: string;
  labels: string[];
  data: { [key: number]: number };
}

const ScaleChart = ({ title, labels, data }: ScaleChartProps) => {
  const maxValue = Math.max(...Object.values(data), 1);

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="space-y-3">
        {labels.map((label, idx) => {
          const scale = idx + 1;
          const value = data[scale] || 0;
          const percentage = (value / maxValue) * 100;

          return (
            <div key={idx}>
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>{label}</span>
                <span className="font-medium">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScaleChart;
