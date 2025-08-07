import React from 'react';

const TopControlPanel = ({ theme, setTheme, mode, setMode }) => {
  return (
    <div className="top-control-panel flex gap">
      <button title="List"><span>≡</span></button>
      <button title="Replay"><span>⟲</span></button>
      <button title="Live"><span>⇄</span></button>
      <button title="Theme: Dark" onClick={() => setTheme('dark')}><span>🌙</span></button>
      <button title="Theme: Light" onClick={() => setTheme('light')}><span>☀️</span></button>
      <button title="Theme: Custom" onClick={() => setTheme('custom')}><span style={{background:'#7ec3fa',width:16,height:16,display:'inline-block',borderRadius:4}}></span></button>
      <span style={{marginLeft:8, fontWeight:600}}>QeeqBox - Raven ★</span>
    </div>
  );
};

export default TopControlPanel;