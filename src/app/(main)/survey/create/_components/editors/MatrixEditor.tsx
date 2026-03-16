'use client';

import React from 'react';
import { X, Plus } from 'lucide-react';
import type { QuestionOption } from '@/stores/surveyCreateStore';

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

interface MatrixEditorProps {
  rows: QuestionOption[];
  columns: QuestionOption[];
  onUpdate: (updates: { matrixRows?: QuestionOption[]; matrixColumns?: QuestionOption[] }) => void;
}

export default function MatrixEditor({ rows, columns, onUpdate }: MatrixEditorProps) {
  const addRow = () =>
    onUpdate({ matrixRows: [...rows, { id: genId(), text: `항목 ${rows.length + 1}` }] });

  const addColumn = () =>
    onUpdate({ matrixColumns: [...columns, { id: genId(), text: String(columns.length + 1) }] });

  const updateRow = (id: string, text: string) =>
    onUpdate({ matrixRows: rows.map((r) => (r.id === id ? { ...r, text } : r)) });

  const updateColumn = (id: string, text: string) =>
    onUpdate({ matrixColumns: columns.map((c) => (c.id === id ? { ...c, text } : c)) });

  const deleteRow = (id: string) =>
    onUpdate({ matrixRows: rows.filter((r) => r.id !== id) });

  const deleteColumn = (id: string) =>
    onUpdate({ matrixColumns: columns.filter((c) => c.id !== id) });

  return (
    <div className="space-y-5">
      {/* Row + Column editors side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Rows */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">행 (항목)</p>
          {rows.map((row, i) => (
            <div key={row.id} className="flex items-center gap-1.5 group">
              <span className="text-xs text-gray-400 w-4 flex-shrink-0 text-right">{i + 1}</span>
              <input
                type="text"
                value={row.text}
                onChange={(e) => updateRow(row.id, e.target.value)}
                className="flex-1 min-w-0 border-b border-gray-200 focus:border-primary-400 text-sm text-gray-700 bg-transparent outline-none py-0.5"
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteRow(row.id)}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors mt-1"
          >
            <Plus size={12} />
            행 추가
          </button>
        </div>

        {/* Columns */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">열 (척도)</p>
          {columns.map((col, i) => (
            <div key={col.id} className="flex items-center gap-1.5 group">
              <span className="text-xs text-gray-400 w-4 flex-shrink-0 text-right">{i + 1}</span>
              <input
                type="text"
                value={col.text}
                onChange={(e) => updateColumn(col.id, e.target.value)}
                className="flex-1 min-w-0 border-b border-gray-200 focus:border-primary-400 text-sm text-gray-700 bg-transparent outline-none py-0.5"
              />
              {columns.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteColumn(col.id)}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addColumn}
            className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors mt-1"
          >
            <Plus size={12} />
            열 추가
          </button>
        </div>
      </div>

      {/* Preview table */}
      {rows.length > 0 && columns.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">미리보기</p>
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-400 font-normal border-b border-gray-100 min-w-[80px]" />
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      className="text-center px-3 py-2 text-gray-600 font-medium border-b border-gray-100 min-w-[52px]"
                    >
                      {col.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.id} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-3 py-2 text-gray-700 border-r border-gray-100">{row.text}</td>
                    {columns.map((col) => (
                      <td key={col.id} className="text-center px-3 py-2">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
