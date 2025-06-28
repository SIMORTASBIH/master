import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    accent: 'bg-blue-600'
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    accent: 'bg-emerald-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    accent: 'bg-purple-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    accent: 'bg-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    accent: 'bg-red-600'
  }
};

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color 
}: StatsCardProps) {
  const colors = colorClasses[color];
  
  const changeColor = {
    increase: 'text-emerald-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${changeColor}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`${colors.bg} p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
      <div className={`mt-4 h-1 ${colors.accent} rounded-full opacity-20`}></div>
    </div>
  );
}