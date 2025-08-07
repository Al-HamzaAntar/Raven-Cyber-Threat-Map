import React, { useState, useRef } from 'react';
import ThreatMap from './components/ThreatMap';
import TopControlPanel from './components/TopControlPanel';
import LiveAttacksPanel from './components/LiveAttacksPanel';
import IPLookupPanel from './components/IPLookupPanel';
import RandomDataPanel from './components/RandomDataPanel';
import CountryStatsPanel from './components/CountryStatsPanel';
import CustomizationPanel from './components/CustomizationPanel';
import { generateRandomAttack, generateAttacksWithDelay } from './utils/attackGenerator.js';
import { calculateCountryStats } from './utils/statsCalculator.js';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('live');
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const [countryStats, setCountryStats] = useState({});
  const [customizations, setCustomizations] = useState({});
  const [showIPLookup, setShowIPLookup] = useState(false);
  const [showRandomData, setShowRandomData] = useState(false);
  const [showLiveAttacks, setShowLiveAttacks] = useState(true);
  const threatMapRef = useRef();

  // Update country stats when attacks change
  React.useEffect(() => {
    const stats = calculateCountryStats(attacks);
    setCountryStats(stats);
  }, [attacks]);

  // Collect attacks from ThreatMap
  const handleNewAttack = (attack) => {
    setAttacks(prev => [...prev.slice(-999), attack]); // Keep last 1000 for large-scale
    setSelectedAttack(attack);
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

  // Handle customization
  const handleCustomize = ({ type, value, color }) => {
    setCustomizations(prev => ({
      ...prev,
      [type === 'country' ? value : `city_${value}`]: color
    }));
  };

  // Toggle functions for panels
  const handleToggleRandomData = () => {
    setShowRandomData(!showRandomData);
  };

  const handleToggleLiveAttacks = () => {
    setShowLiveAttacks(!showLiveAttacks);
  };

  return (
    <div className={`App theme-${theme}`} style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <TopControlPanel 
        theme={theme} 
        setTheme={setTheme} 
        mode={mode} 
        setMode={setMode}
        onToggleRandomData={handleToggleRandomData}
        onToggleLiveAttacks={handleToggleLiveAttacks}
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
      {/* Floating attack info at bottom center */}
      {selectedAttack && (
        <div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',background:'#232526cc',color:'#e0e0e0',padding:'0.7em 2em',borderRadius:8,boxShadow:'0 2px 16px #000a',zIndex:12,fontSize:'1.1em',display:'flex',gap:40,alignItems:'center'}}>
          <div>{new Date(selectedAttack.timestamp).toLocaleString()}</div>
          <div className="country-code">{selectedAttack.source.countryCode || '--'}</div>
          <div>City: {selectedAttack.source.city} <br/>Country: {selectedAttack.source.country}</div>
          <div className="arrow">→</div>
          <div className="country-code">{selectedAttack.target.countryCode || '--'}</div>
          <div>City: {selectedAttack.target.city} <br/>Country: {selectedAttack.target.country}</div>
        </div>
      )}
    </div>
  );
}

export default App;
