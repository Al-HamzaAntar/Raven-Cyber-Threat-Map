import React, { useState, useRef } from 'react';
import ThreatMap from './components/ThreatMap';
import TopControlPanel from './components/TopControlPanel';
import LiveAttacksPanel from './components/LiveAttacksPanel';
import IPLookupPanel from './components/IPLookupPanel';
import RandomDataPanel from './components/RandomDataPanel';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('live'); // 'live' or 'replay'
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [attacks, setAttacks] = useState([]);

  // Collect attacks from ThreatMap
  const handleNewAttack = (attack) => {
    setAttacks(prev => [...prev.slice(-49), attack]); // keep last 50
    setSelectedAttack(attack);
  };

  return (
    <div className={`App theme-${theme}`} style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <TopControlPanel theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />
      <LiveAttacksPanel attacks={attacks} />
      <IPLookupPanel />
      <RandomDataPanel />
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
        <ThreatMap theme={theme} mode={mode} onAttackSelect={setSelectedAttack} onNewAttack={handleNewAttack} />
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
