
export interface Indicator {
  id: string;
  text: string;
}

export interface SubCompetency {
  id: string;
  title: string;
  indicators: Indicator[];
}

export interface CompetencyCategory {
  id: string;
  name: string;
  subCompetencies: SubCompetency[];
}

export interface SelectedIndicators {
  [key: string]: boolean;
}
