import React from 'react';
import { Gift } from 'lucide-react';

interface RewardBadgeProps {
  points: number;
  variant?: 'default' | 'large';
}

const RewardBadge = ({ points, variant = 'default' }: RewardBadgeProps) => {
  const isLarge = variant === 'large';

  return (
    <div className={`inline-flex items-center gap-2 ${isLarge ? 'bg-primary-50 px-4 py-3 rounded-xl' : 'bg-yellow-50 px-3 py-1 rounded-full'}`}>
      <Gift size={isLarge ? 24 : 16} className="text-primary-500" />
      <span className={`font-semibold ${isLarge ? 'text-lg text-primary-600' : 'text-sm text-gray-800'}`}>
        {points}P
      </span>
    </div>
  );
};

export default RewardBadge;
