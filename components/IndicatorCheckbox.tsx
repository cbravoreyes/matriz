
import React from 'react';
import { Indicator } from '../types';

interface IndicatorCheckboxProps {
  indicator: Indicator;
  isSelected: boolean;
  onToggle: (indicatorId: string) => void;
}

const IndicatorCheckbox: React.FC<IndicatorCheckboxProps> = ({ indicator, isSelected, onToggle }) => {
  const handleToggle = () => {
    onToggle(indicator.id);
  };

  return (
    <li className="flex items-start py-2 px-3 hover:bg-sky-50 rounded-md transition-colors duration-150">
      <input
        id={`indicator-${indicator.id}`}
        type="checkbox"
        checked={isSelected}
        onChange={handleToggle}
        className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary-light mt-1 cursor-pointer"
      />
      <label htmlFor={`indicator-${indicator.id}`} className="ml-3 text-sm text-gray-700 cursor-pointer flex-1">
        {indicator.text}
      </label>
    </li>
  );
};

export default IndicatorCheckbox;
