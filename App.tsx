
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { COMPETENCIES_DATA } from './constants';
import { SelectedIndicators } from './types';
import CompetencyCategoryCard from './components/CompetencyCategoryCard';

// Extend window type to include pipwerks
declare global {
  interface Window {
    pipwerks: any;
  }
}

const App: React.FC = () => {
  const [selectedIndicators, setSelectedIndicators] = useState<SelectedIndicators>({});
  const scormAPIRef = useRef<any>(null); // To store the SCORM API object
  const isScormInitialized = useRef(false); // To track SCORM init state

  // Refs to hold the latest state for cleanup/beforeunload
  const latestSelectedIndicatorsRef = useRef(selectedIndicators);
  useEffect(() => {
    latestSelectedIndicatorsRef.current = selectedIndicators;
  }, [selectedIndicators]);

  const totalSelectedCount = useMemo(() => {
    return Object.values(selectedIndicators).filter(isSelected => isSelected).length;
  }, [selectedIndicators]);

  const latestTotalSelectedCountRef = useRef(totalSelectedCount);
  useEffect(() => {
    latestTotalSelectedCountRef.current = totalSelectedCount;
  }, [totalSelectedCount]);

  const totalIndicatorsCount = useMemo(() => {
    return COMPETENCIES_DATA.reduce((acc, category) => 
      acc + category.subCompetencies.reduce((subAcc, subComp) => 
        subAcc + subComp.indicators.length, 0), 0);
  }, []);

  // SCORM Initialization, data loading, and cleanup
  useEffect(() => {
    // Check if pipwerks and pipwerks.SCORM are available
    if (typeof window.pipwerks === 'undefined' || typeof window.pipwerks.SCORM === 'undefined') {
      console.error("SCORM API wrapper (pipwerks) not found or not ready. Ensure scorm_api_wrapper.js is loaded before this script.");
      return; // Exit if SCORM API is not available
    }

    const scorm = window.pipwerks.SCORM; // Access SCORM API here
    scormAPIRef.current = scorm; // Store it in the ref

    // Optional: Configure pipwerks wrapper (e.g., for debugging)
    // scorm.configure({ debug: true }); 

    isScormInitialized.current = scorm.init();
    if (isScormInitialized.current) {
      console.log("SCORM: Connection initialized.");

      const suspendData = scorm.get("cmi.core.suspend_data");
      if (suspendData && suspendData !== "") {
        try {
          const parsedData = JSON.parse(suspendData);
          setSelectedIndicators(parsedData); // This will trigger re-render and update refs
          console.log("SCORM: Loaded suspend_data:", parsedData);
        } catch (e) {
          console.error("SCORM: Error parsing suspend_data:", e, "Raw data:", suspendData);
        }
      }

      let lessonStatus = scorm.get("cmi.core.lesson_status");
      console.log("SCORM: Initial lesson_status:", lessonStatus);
      if (lessonStatus === "not attempted") {
        scorm.set("cmi.core.lesson_status", "incomplete");
        console.log("SCORM: Set lesson_status to incomplete");
      }
      scorm.save(); // Commit initial status and any loaded data
    } else {
      console.error("SCORM: Connection failed to initialize. Check LMS and SCORM API availability.");
    }

    const handleBeforeUnload = () => {
      const activeScorm = scormAPIRef.current;
      if (activeScorm && isScormInitialized.current && activeScorm.connection.isActive) {
        console.log("SCORM: beforeunload - saving data");
        activeScorm.set("cmi.core.suspend_data", JSON.stringify(latestSelectedIndicatorsRef.current));
        
        const currentStatus = activeScorm.get("cmi.core.lesson_status");
        if (latestTotalSelectedCountRef.current > 0 && currentStatus !== "completed") {
           activeScorm.set("cmi.core.lesson_status", "completed");
           console.log("SCORM: beforeunload - Set lesson_status to completed");
        }
        
        if (activeScorm.get("cmi.core.lesson_status") === "incomplete") {
            activeScorm.set("cmi.core.exit", "suspend");
        } else {
            activeScorm.set("cmi.core.exit", ""); // Normal exit for SCORM 1.2
        }
        activeScorm.save(); // Commit before unload
        // LMSFinish/quit should NOT be called here as the window is closing. LMS handles it.
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function for unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      const activeScorm = scormAPIRef.current;
      if (activeScorm && isScormInitialized.current && activeScorm.connection.isActive) {
        console.log("SCORM: Unmounting - saving and terminating connection.");
        activeScorm.set("cmi.core.suspend_data", JSON.stringify(latestSelectedIndicatorsRef.current));
        
        const currentStatus = activeScorm.get("cmi.core.lesson_status");
        if (latestTotalSelectedCountRef.current > 0 && currentStatus !== "completed") {
           activeScorm.set("cmi.core.lesson_status", "completed");
           console.log("SCORM: Unmount - Set lesson_status to completed");
        }
        
        if (activeScorm.get("cmi.core.lesson_status") === "incomplete") {
            activeScorm.set("cmi.core.exit", "suspend");
        } else {
            activeScorm.set("cmi.core.exit", ""); 
        }
        
        activeScorm.save(); // Final save
        activeScorm.quit(); // Terminate the connection
        isScormInitialized.current = false; // Reset the flag
        console.log("SCORM: Connection terminated.");
      }
    };
  }, []); // Empty dependency array: run once on mount, cleanup on unmount

  // SCORM data saving on selectedIndicators change
  useEffect(() => {
    const activeScorm = scormAPIRef.current;
    // Ensure SCORM is initialized and active before trying to set data
    if (activeScorm && isScormInitialized.current && activeScorm.connection.isActive) {
      console.log("SCORM: Selection changed - saving data.");
      activeScorm.set("cmi.core.suspend_data", JSON.stringify(selectedIndicators));
      
      const currentStatus = activeScorm.get("cmi.core.lesson_status");
      if (totalSelectedCount > 0 && currentStatus !== "completed") {
        activeScorm.set("cmi.core.lesson_status", "completed");
        console.log("SCORM: Set lesson_status to completed due to interaction.");
      }
      
      activeScorm.save();
      console.log("SCORM: Data saved. Suspend data:", JSON.stringify(selectedIndicators), "Status:", activeScorm.get("cmi.core.lesson_status"));
    }
  }, [selectedIndicators, totalSelectedCount]); // Dependencies for this effect

  const handleToggleIndicator = useCallback((indicatorId: string) => {
    setSelectedIndicators(prev => ({
      ...prev,
      [indicatorId]: !prev[indicatorId]
    }));
  }, []);

  const handleToggleSubCompetency = useCallback((subCompetencyId: string, selectAll: boolean) => {
    setSelectedIndicators(prev => {
      const newSelected = { ...prev };
      COMPETENCIES_DATA.forEach(category => {
        const subCompetency = category.subCompetencies.find(sc => sc.id === subCompetencyId);
        if (subCompetency) {
          subCompetency.indicators.forEach(indicator => {
            newSelected[indicator.id] = selectAll;
          });
        }
      });
      return newSelected;
    });
  }, []);

  const handleToggleCategory = useCallback((categoryId: string, selectAll: boolean) => {
    setSelectedIndicators(prev => {
      const newSelected = { ...prev };
      const category = COMPETENCIES_DATA.find(cat => cat.id === categoryId);
      if (category) {
        category.subCompetencies.forEach(subCompetency => {
          subCompetency.indicators.forEach(indicator => {
            newSelected[indicator.id] = selectAll;
          });
        });
      }
      return newSelected;
    });
  }, []);
  
  const handleResetSelections = useCallback(() => {
    setSelectedIndicators({});
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      <header className="mb-8 p-6 bg-primary text-white rounded-lg shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center">Matriz de Competencias con Indicadores Observables</h1>
        <p className="text-center text-primary-light mt-2 text-lg">
          Seleccione los indicadores de competencia que desea evaluar o seguir.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p className="text-xl font-semibold">
                Indicadores Seleccionados: {totalSelectedCount} / {totalIndicatorsCount}
            </p>
            {totalSelectedCount > 0 && (
                 <button 
                    onClick={handleResetSelections}
                    className="px-4 py-2 bg-accent text-primary-dark font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-150"
                    aria-label="Limpiar todas las selecciones de indicadores"
                 >
                    Limpiar Selección
                 </button>
            )}
        </div>
      </header>

      <main>
        {COMPETENCIES_DATA.map((category) => (
          <CompetencyCategoryCard
            key={category.id}
            category={category}
            selectedIndicators={selectedIndicators}
            onToggleIndicator={handleToggleIndicator}
            onToggleSubCompetency={handleToggleSubCompetency}
            onToggleCategory={handleToggleCategory}
          />
        ))}
      </main>

      <footer className="mt-12 py-6 text-center text-gray-500 border-t border-gray-300">
        <p>&copy; {new Date().getFullYear()} Selector de Competencias. Todos los derechos reservados.</p>
        <p className="text-sm">Una herramienta para facilitar la evaluación y desarrollo profesional.</p>
      </footer>
    </div>
  );
};

export default App;
    