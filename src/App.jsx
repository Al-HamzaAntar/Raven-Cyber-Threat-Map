import React, { useState, useRef } from 'react';
import ThreatMap from './components/ThreatMap';
import TopControlPanel from './components/TopControlPanel';
import LiveAttacksPanel from './components/LiveAttacksPanel';
import IPLookupPanel from './components/IPLookupPanel';
import RandomDataPanel from './components/RandomDataPanel';
import './App.css';

// Example data for random generation
const locations = [
  { country: 'United States', countryCode: 'US', city: 'New York', lat: 40.7128, lon: -74.0060 },
  { country: 'Germany', countryCode: 'DE', city: 'Berlin', lat: 52.52, lon: 13.405 },
  { country: 'China', countryCode: 'CN', city: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { country: 'Brazil', countryCode: 'BR', city: 'Rio', lat: -22.9068, lon: -43.1729 },
  { country: 'India', countryCode: 'IN', city: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { country: 'Australia', countryCode: 'AU', city: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { country: 'Russia', countryCode: 'RU', city: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { country: 'UK', countryCode: 'GB', city: 'London', lat: 51.5074, lon: -0.1278 },
  { country: 'South Africa', countryCode: 'ZA', city: 'Cape Town', lat: -33.9249, lon: 18.4241 },
  { country: 'Japan', countryCode: 'JP', city: 'Tokyo', lat: 35.6895, lon: 139.6917 },
];
const threatTypes = ['malware', 'phishing', 'ddos', 'ransomware'];

function randomIP() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 255)).join('.');
}
function randomPort() {
  return Math.floor(Math.random() * 65535);
}
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('live'); // 'live' or 'replay'
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [attacks, setAttacks] = useState([]);
  const threatMapRef = useRef();

  // Collect attacks from ThreatMap
  const handleNewAttack = (attack) => {
    setAttacks(prev => [...prev.slice(-49), attack]); // keep last 50
    setSelectedAttack(attack);
  };

  // Generate random attacks based on config
  const handleGenerate = async ({ attacks: n, time, delay, selected }) => {
    let generated = [];
    for (let i = 0; i < n; ++i) {
      let source = randomFromArray(locations);
      let target = randomFromArray(locations);
      while (target === source) target = randomFromArray(locations);
      let attack = {
        type: randomFromArray(threatTypes),
        source: {
          ...source,
          ip: selected.IPs ? randomIP() : '',
          port: selected.Coordinates ? randomPort() : '',
          city: selected.Cities ? source.city : '',
          country: selected.Countries ? source.country : '',
          countryCode: selected.Countries ? source.countryCode : '',
        },
        target: {
          ...target,
          ip: selected.IPs ? randomIP() : '',
          port: selected.Coordinates ? randomPort() : '',
          city: selected.Cities ? target.city : '',
          country: selected.Countries ? target.country : '',
          countryCode: selected.Countries ? target.countryCode : '',
        },
        timestamp: Date.now() + i * delay,
      };
      generated.push(attack);
    }
    // Animate on map and add to attacks list
    if (threatMapRef.current && threatMapRef.current.animateAttacks) {
      threatMapRef.current.animateAttacks(generated, delay);
    }
    // Add to live attacks panel
    for (let i = 0; i < generated.length; ++i) {
      setTimeout(() => handleNewAttack(generated[i]), i * delay);
    }
  };

  return (
    <div className={`App theme-${theme}`} style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <TopControlPanel theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />
      <LiveAttacksPanel attacks={attacks} />
      <IPLookupPanel />
      <RandomDataPanel onGenerate={handleGenerate} />
      <div style={{ width: '100vw', height: '100vh', position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
        <ThreatMap ref={threatMapRef} theme={theme} mode={mode} onAttackSelect={setSelectedAttack} onNewAttack={handleNewAttack} />
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
