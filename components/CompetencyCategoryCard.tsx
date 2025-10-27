
import React from 'react';
import { CompetencyCategory, SelectedIndicators } from '../types';
import SubCompetencyItem from './SubCompetencyItem';

interface CompetencyCategoryCardProps {
  category: CompetencyCategory;
  selectedIndicators: SelectedIndicators;
  onToggleIndicator: (indicatorId: string) => void;
  onToggleSubCompetency: (subCompetencyId: string, selectAll: boolean) => void;
  onToggleCategory: (categoryId: string, selectAll: boolean) => void;
}

const CompetencyCategoryCard: React.FC<CompetencyCategoryCardProps> = ({ 
  category, 
  selectedIndicators, 
  onToggleIndicator, 
  onToggleSubCompetency,
  onToggleCategory
}) => {
  const allIndicatorsInCategorySelected = category.subCompetencies.flatMap(sc => sc.indicators).every(ind => selectedIndicators[ind.id]);
  const someIndicatorsInCategorySelected = category.subCompetencies.flatMap(sc => sc.indicators).some(ind => selectedIndicators[ind.id]) && !allIndicatorsInCategorySelected;

  const handleToggleAllCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleCategory(category.id, event.target.checked);
  };

  return (
    <div className="mb-8 bg-secondary p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-primary-light">
        <h2 className="text-2xl font-bold text-primary">{category.name}</h2>
        <div className="flex items-center">
           <input
            type="checkbox"
            checked={allIndicatorsInCategorySelected}
            ref={input => { // Handle indeterminate state
              if (input) {
                input.indeterminate = someIndicatorsInCategorySelected;
              }
            }}
            onChange={handleToggleAllCategory}
            className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary-light cursor-pointer"
            title={allIndicatorsInCategorySelected ? `Deseleccionar todo en ${category.name}` : `Seleccionar todo en ${category.name}`}
          />
          <label className="ml-2 text-sm text-gray-600">
            {allIndicatorsInCategorySelected ? "Todos seleccionados" : "Seleccionar todos en categoría"}
          </label>
        </div>
      </div>
      {category.subCompetencies.map((subCompetency) => (
        <SubCompetencyItem
          key={subCompetency.id}
          subCompetency={subCompetency}
          selectedIndicators={selectedIndicators}
          onToggleIndicator={onToggleIndicator}
          onToggleSubCompetency={onToggleSubCompetency}
        />
      ))}
    </div>
  );
};

export default CompetencyCategoryCard;
