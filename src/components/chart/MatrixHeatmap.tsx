import React from 'react';

interface MatrixHeatmapProps {
  title?: string;
  rows: string[];
  columns: string[];
  data: { [row: string]: { [col: string]: number } };
}

const MatrixHeatmap = ({ title, rows, columns, data }: MatrixHeatmapProps) => {
  const maxValue = Math.max(
    ...rows.flatMap((row) => columns.map((col) => data[row]?.[col] || 0))
  );

  const getColor = (value: number) => {
    const percentage = (value / maxValue) * 100;
    if (percentage === 0) return 'bg-gray-100';
    if (percentage < 25) return 'bg-primary-100';
    if (percentage < 50) return 'bg-primary-300';
    if (percentage < 75) return 'bg-primary-500';
    return 'bg-primary-700';
  };

  return (
    <div className="w-full overflow-x-auto">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="px-3 py-2 border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 text-left"></th>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 text-center max-w-20">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="px-3 py-2 border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700">
                {row}
              </td>
              {columns.map((col) => {
                const value = data[row]?.[col] || 0;
                return (
                  <td
                    key={`${row}-${col}`}
                    className={`px-3 py-2 border border-gray-200 text-center font-medium text-sm ${getColor(value)} ${value > 0 ? 'text-white' : 'text-gray-600'}`}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatrixHeatmap;
