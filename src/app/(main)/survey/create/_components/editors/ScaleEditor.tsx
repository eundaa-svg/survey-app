'use client';

interface ScaleEditorProps {
  scaleMin: number;
  scaleMax: number;
  scaleLabelMin: string;
  scaleLabelMax: string;
  onUpdate: (updates: {
    scaleMin?: number;
    scaleMax?: number;
    scaleLabelMin?: string;
    scaleLabelMax?: string;
  }) => void;
}

export default function ScaleEditor({
  scaleMin,
  scaleMax,
  scaleLabelMin,
  scaleLabelMax,
  onUpdate,
}: ScaleEditorProps) {
  const values = Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => scaleMin + i);

  return (
    <div className="space-y-5">
      {/* Range selector */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500 font-medium">범위</span>
        <select
          value={scaleMin}
          onChange={(e) => onUpdate({ scaleMin: Number(e.target.value) })}
          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-primary-400 bg-white"
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
        </select>
        <span className="text-gray-400 font-medium">~</span>
        <select
          value={scaleMax}
          onChange={(e) => onUpdate({ scaleMax: Number(e.target.value) })}
          className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-primary-400 bg-white"
        >
          <option value={5}>5</option>
          <option value={7}>7</option>
          <option value={10}>10</option>
        </select>
      </div>

      {/* Scale buttons preview */}
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <div
            key={v}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm text-gray-500 select-none"
          >
            {v}
          </div>
        ))}
      </div>

      {/* Min / Max labels */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex-shrink-0">{scaleMin} =</span>
          <input
            type="text"
            value={scaleLabelMin}
            onChange={(e) => onUpdate({ scaleLabelMin: e.target.value })}
            placeholder="최솟값 레이블"
            className="border-b border-gray-300 focus:border-primary-400 text-sm text-gray-700 bg-transparent outline-none pb-0.5 w-28"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex-shrink-0">{scaleMax} =</span>
          <input
            type="text"
            value={scaleLabelMax}
            onChange={(e) => onUpdate({ scaleLabelMax: e.target.value })}
            placeholder="최댓값 레이블"
            className="border-b border-gray-300 focus:border-primary-400 text-sm text-gray-700 bg-transparent outline-none pb-0.5 w-28"
          />
        </div>
      </div>
    </div>
  );
}
