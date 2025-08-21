import React, { useRef } from 'react';
import ThreatMap from './components/ThreatMap';
import TopControlPanel from './components/TopControlPanel';
import LiveAttacksPanel from './components/LiveAttacksPanel';
import IPLookupPanel from './components/IPLookupPanel';
import RandomDataPanel from './components/RandomDataPanel';
import CountryStatsPanel from './components/CountryStatsPanel';
import CustomizationPanel from './components/CustomizationPanel';
import { generateAttacksWithDelay } from './utils/attackGenerator.js';
import { calculateCountryStats } from './utils/statsCalculator.js';
import useAppStore from './stores/useAppStore.js';
import './App.css';

function App() {
  const threatMapRef = useRef();
  
  // Zustand store state and actions
  const {
    theme,
    mode,
    selectedAttack,
    attacks,
    countryStats,
    customizations,
    showIPLookup,
    showRandomData,
    showLiveAttacks,
    setTheme,
    setMode,
    addAttack,
    setSelectedAttack,
    setShowIPLookup,
    setShowRandomData,
    setShowLiveAttacks,
    handleCustomize
  } = useAppStore();

  // Update country stats when attacks change
  React.useEffect(() => {
    const stats = calculateCountryStats(attacks);
    // Update country stats in store
  }, [attacks]);

  // Handle new attack from ThreatMap
  const handleNewAttack = (attack) => {
    addAttack(attack);
  };

  // Generate random attacks based on config
  const handleGenerate = async ({ attacks: n, time, delay, config }) => {
    const generatedAttacks = generateAttacksWithDelay(n, delay, config);
    
    // Animate on map and add to attacks list
    if (threatMapRef.current && threatMapRef.current.animateAttacks) {
      threatMapRef.current.animateAttacks(generatedAttacks, delay);
    }
    
    // Add to live attacks panel with delay
    for (let i = 0; i < generatedAttacks.length; ++i) {
      setTimeout(() => handleNewAttack(generatedAttacks[i]), i * delay);
    }
  };

  return (
    <div className={`App theme-${theme}`} style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <TopControlPanel 
        theme={theme} 
        setTheme={setTheme} 
        mode={mode} 
        setMode={setMode}
        onToggleRandomData={() => setShowRandomData(!showRandomData)}
        onToggleLiveAttacks={() => setShowLiveAttacks(!showLiveAttacks)}
        onShowIPLookup={() => setShowIPLookup(v => !v)}
      />
      {showLiveAttacks && <LiveAttacksPanel attacks={attacks} />}
      {showIPLookup && <IPLookupPanel />}
      {showRandomData && <RandomDataPanel onGenerate={handleGenerate} />}
      <CountryStatsPanel stats={countryStats} />
      <CustomizationPanel onCustomize={handleCustomize} />
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
        <ThreatMap 
          ref={threatMapRef} 
          theme={theme} 
          mode={mode} 
          onAttackSelect={setSelectedAttack} 
          onNewAttack={handleNewAttack}
          customizations={customizations}
        />
      </div>
      {/* Enhanced floating attack info */}
      {selectedAttack && (
        <div className="attack-info">
          <div className="timestamp">
            {new Date(selectedAttack.timestamp).toLocaleString()}
          </div>
          <div className="country-code">{selectedAttack.source.countryCode || '--'}</div>
          <div className="location">
            <strong>From:</strong> {selectedAttack.source.city}<br/>
            <span>{selectedAttack.source.country}</span>
          </div>
          <div className="arrow">→</div>
          <div className="country-code">{selectedAttack.target.countryCode || '--'}</div>
          <div className="location">
            <strong>To:</strong> {selectedAttack.target.city}<br/>
            <span>{selectedAttack.target.country}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
