
import { CompetencyCategory } from './types';

export const COMPETENCIES_DATA: CompetencyCategory[] = [
  {
    id: 'cat-pd',
    name: 'Pedagógico-didáctica',
    subCompetencies: [
      {
        id: 'sub-pd-di',
        title: 'Diseño instruccional digital',
        indicators: [
          { id: 'ind-pd-di-1', text: 'Presenta un plan de aula virtual con objetivos claros, secuencia lógica y estrategias activas.' },
          { id: 'ind-pd-di-2', text: 'Relaciona los contenidos con actividades y recursos adecuados.' },
          { id: 'ind-pd-di-3', text: 'Define criterios de evaluación en coherencia con los objetivos.' },
        ],
      },
      {
        id: 'sub-pd-sdr',
        title: 'Selección didáctica de recursos digitales',
        indicators: [
          { id: 'ind-pd-sdr-1', text: 'Emplea criterios pedagógicos para justificar la elección de un recurso.' },
          { id: 'ind-pd-sdr-2', text: 'Utiliza herramientas o matrices de evaluación de recursos digitales.' },
          { id: 'ind-pd-sdr-3', text: 'Contextualiza los recursos al perfil de sus estudiantes.' },
        ],
      },
      {
        id: 'sub-pd-efd',
        title: 'Evaluación formativa digital',
        indicators: [
          { id: 'ind-pd-efd-1', text: 'Crea actividades de evaluación en plataformas digitales.' },
          { id: 'ind-pd-efd-2', text: 'Incluye retroalimentación formativa clara y pertinente.' },
          { id: 'ind-pd-efd-3', text: 'Diversifica instrumentos (rúbricas, listas de cotejo, autoevaluación).' },
        ],
      },
      {
        id: 'sub-pd-dm',
        title: 'Diversificación metodológica',
        indicators: [
          { id: 'ind-pd-dm-1', text: 'Aplica al menos una metodología activa con apoyo de TIC.' },
          { id: 'ind-pd-dm-2', text: 'Justifica su selección con fundamentos pedagógicos.' },
          { id: 'ind-pd-dm-3', text: 'Integra la metodología al diseño de su aula virtual.' },
        ],
      },
    ],
  },
  {
    id: 'cat-tp',
    name: 'Tecnológica y de producción',
    subCompetencies: [
      {
        id: 'sub-tp-ada',
        title: 'Alfabetización digital avanzada',
        indicators: [
          { id: 'ind-tp-ada-1', text: 'Domina funciones avanzadas de herramientas digitales.' },
          { id: 'ind-tp-ada-2', text: 'Usa con autonomía un LMS para estructurar su curso.' },
          { id: 'ind-tp-ada-3', text: 'Participa de forma colaborativa en entornos digitales.' },
        ],
      },
      {
        id: 'sub-tp-dpm',
        title: 'Diseño y producción multimedia',
        indicators: [
          { id: 'ind-tp-dpm-1', text: 'Elabora materiales educativos multimedia.' },
          { id: 'ind-tp-dpm-2', text: 'Aplica principios de diseño visual y audiovisual.' },
          { id: 'ind-tp-dpm-3', text: 'Asegura la funcionalidad técnica del recurso.' },
        ],
      },
      {
        id: 'sub-tp-cdc',
        title: 'Curación digital de contenidos',
        indicators: [
          { id: 'ind-tp-cdc-1', text: 'Localiza y selecciona recursos abiertos pertinentes.' },
          { id: 'ind-tp-cdc-2', text: 'Evalúa recursos con criterios de calidad y vigencia.' },
          { id: 'ind-tp-cdc-3', text: 'Cita correctamente la fuente de los recursos.' },
        ],
      },
      {
        id: 'sub-tp-if',
        title: 'Interoperabilidad y formatos',
        indicators: [
          { id: 'ind-tp-if-1', text: 'Exporta materiales en formatos compatibles con LMS.' },
          { id: 'ind-tp-if-2', text: 'Integra recursos digitales sin pérdida de funcionalidad.' },
          { id: 'ind-tp-if-3', text: 'Reconoce y corrige errores de formato.' },
        ],
      },
    ],
  },
  {
    id: 'cat-ci',
    name: 'Comunicacional e interactiva',
    subCompetencies: [
      {
        id: 'sub-ci-ced',
        title: 'Comunicación educativa digital',
        indicators: [
          { id: 'ind-ci-ced-1', text: 'Redacta mensajes claros, inclusivos y motivadores.' },
          { id: 'ind-ci-ced-2', text: 'Formula consignas comprensibles y completas.' },
          { id: 'ind-ci-ced-3', text: 'Promueve el diálogo en espacios digitales.' },
        ],
      },
      {
        id: 'sub-ci-deva',
        title: 'Diseño de entornos virtuales amigables',
        indicators: [
          { id: 'ind-ci-deva-1', text: 'Organiza contenidos con lógica y funcionalidad.' },
          { id: 'ind-ci-deva-2', text: 'Usa elementos gráficos para facilitar navegación.' },
          { id: 'ind-ci-deva-3', text: 'Mantiene coherencia visual entre secciones.' },
        ],
      },
      {
        id: 'sub-ci-iav',
        title: 'Interacción y acompañamiento virtual',
        indicators: [
          { id: 'ind-ci-iav-1', text: 'Participa activamente en foros.' },
          { id: 'ind-ci-iav-2', text: 'Realiza seguimiento al progreso estudiantil.' },
          { id: 'ind-ci-iav-3', text: 'Promueve el trabajo colaborativo y la autonomía.' },
        ],
      },
    ],
  },
  {
    id: 'cat-ea',
    name: 'Ética y accesibilidad',
    subCompetencies: [
      {
        id: 'sub-ea-uet',
        title: 'Uso ético de tecnologías',
        indicators: [
          { id: 'ind-ea-uet-1', text: 'Reconoce y respeta los derechos de autor.' },
          { id: 'ind-ea-uet-2', text: 'Protege los datos personales.' },
          { id: 'ind-ea-uet-3', text: 'Fomenta prácticas académicas éticas.' },
        ],
      },
      {
        id: 'sub-ea-aid',
        title: 'Accesibilidad e inclusión digital',
        indicators: [
          { id: 'ind-ea-aid-1', text: 'Usa subtítulos, texto alternativo, lenguaje claro.' },
          { id: 'ind-ea-aid-2', text: 'Aplica normas básicas de accesibilidad (WCAG).' },
          { id: 'ind-ea-aid-3', text: 'Evalúa materiales con enfoque inclusivo.' },
        ],
      },
    ],
  },
  {
    id: 'cat-rm',
    name: 'Reflexiva y metacognitiva',
    subCompetencies: [
      {
        id: 'sub-rm-ecre',
        title: 'Evaluación crítica del recurso elaborado',
        indicators: [
          { id: 'ind-rm-ecre-1', text: 'Aplica criterios para valorar sus materiales.' },
          { id: 'ind-rm-ecre-2', text: 'Integra retroalimentación para mejorar.' },
          { id: 'ind-rm-ecre-3', text: 'Explica decisiones en su proceso de mejora.' },
        ],
      },
      {
        id: 'sub-rm-ap',
        title: 'Actualización permanente',
        indicators: [
          { id: 'ind-rm-ap-1', text: 'Registra nuevas herramientas exploradas.' },
          { id: 'ind-rm-ap-2', text: 'Comparte aprendizajes con pares.' },
          { id: 'ind-rm-ap-3', text: 'Integra novedades tecnológicas con criterio didáctico.' },
        ],
      },
    ],
  },
];
