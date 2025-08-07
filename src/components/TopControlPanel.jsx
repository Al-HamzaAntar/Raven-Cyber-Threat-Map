import React from 'react';

const TopControlPanel = ({ theme, setTheme, mode, setMode, onToggleRandomData, onToggleLiveAttacks, onShowIPLookup }) => {
  const handlePenClick = () => {
    if (onShowIPLookup) onShowIPLookup();
  };
  const handleLiveClick = () => {
    if (onToggleLiveAttacks) onToggleLiveAttacks();
  };

  const handleReplayClick = () => {
    window.location.reload();
  };

  const handleListClick = () => {
    if (onToggleRandomData) onToggleRandomData();
  };

  return (
    <div className="top-control-panel flex gap">
      <button title="List" onClick={handleListClick}><span>≡</span></button>
      <button title="Replay" onClick={handleReplayClick}><span>⟲</span></button>
      <button title="Live" onClick={handleLiveClick}><span>⇄</span></button>
      <button title="Check IP or Mobile" onClick={handlePenClick} style={{fontSize:'1.2em'}}><span role="img" aria-label="pen">✎</span></button>
      <button title="Theme: Dark" onClick={() => setTheme('dark')}><span>🌙</span></button>
      <button title="Theme: Light" onClick={() => setTheme('light')}><span>☀️</span></button>
      <button title="Theme: Custom" onClick={() => setTheme('custom')}><span style={{background:'#7ec3fa',width:16,height:16,display:'inline-block',borderRadius:4}}></span></button>
      <span style={{marginLeft:8, fontWeight:600}}>QeeqBox - Raven ★</span>
    </div>
  );
};

export default TopControlPanel;