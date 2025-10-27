
import React from 'react';
import { SubCompetency, SelectedIndicators } from '../types';
import IndicatorCheckbox from './IndicatorCheckbox';

interface SubCompetencyItemProps {
  subCompetency: SubCompetency;
  selectedIndicators: SelectedIndicators;
  onToggleIndicator: (indicatorId: string) => void;
  onToggleSubCompetency: (subCompetencyId: string, selectAll: boolean) => void;
}

const SubCompetencyItem: React.FC<SubCompetencyItemProps> = ({ 
  subCompetency, 
  selectedIndicators, 
  onToggleIndicator,
  onToggleSubCompetency
}) => {
  const allIndicatorsInSubCompetencySelected = subCompetency.indicators.every(ind => selectedIndicators[ind.id]);
  const someIndicatorsInSubCompetencySelected = subCompetency.indicators.some(ind => selectedIndicators[ind.id]) && !allIndicatorsInSubCompetencySelected;

  const handleToggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleSubCompetency(subCompetency.id, event.target.checked);
  };
  
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-primary-dark">{subCompetency.title}</h3>
        <div className="flex items-center">
           <input
            type="checkbox"
            checked={allIndicatorsInSubCompetencySelected}
            ref={input => { // Handle indeterminate state
              if (input) {
                input.indeterminate = someIndicatorsInSubCompetencySelected;
              }
            }}
            onChange={handleToggleAll}
            className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary-light cursor-pointer"
            title={allIndicatorsInSubCompetencySelected ? "Deseleccionar todo" : "Seleccionar todo"}
          />
          <label className="ml-2 text-xs text-gray-500">
            {allIndicatorsInSubCompetencySelected ? "Todos seleccionados" : "Seleccionar todos"}
          </label>
        </div>
      </div>
      <ul className="space-y-1">
        {subCompetency.indicators.map((indicator) => (
          <IndicatorCheckbox
            key={indicator.id}
            indicator={indicator}
            isSelected={!!selectedIndicators[indicator.id]}
            onToggle={onToggleIndicator}
          />
        ))}
      </ul>
    </div>
  );
};

export default SubCompetencyItem;
