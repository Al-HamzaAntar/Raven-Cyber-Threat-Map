import React from 'react';
import { ImSun } from "react-icons/im";
import { BsMoonFill } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { GrRefresh } from "react-icons/gr";
import { TiThMenu } from "react-icons/ti";

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
      <button title="List" onClick={handleListClick} className="secondary">
        <TiThMenu />
      </button>
      <button title="Replay" onClick={handleReplayClick} className="secondary">
        <GrRefresh />
      </button>
      <button title="Live" onClick={handleLiveClick} className="secondary">
        <HiOutlineSwitchHorizontal />
      </button>
      <button title="Check IP or Mobile" onClick={handlePenClick} className="secondary">
        <FaPen />
      </button>
      <button title="Theme: Dark" onClick={() => setTheme('dark')}>
        <BsMoonFill />
      </button>
      <button title="Theme: Light" onClick={() => setTheme('light')}>
        <ImSun />
      </button>
      <button title="Theme: Custom" onClick={() => setTheme('custom')}>
        <span style={{
          background: 'var(--gray-50)',
          width: 16,
          height: 16,
          display: 'inline-block',
          borderRadius: 'var(--radius-sm)'
        }}></span>
      </button>
      <div className="flex" style={{ marginLeft: 'var(--space-4)' }}>
        <span style={{ 
          marginLeft: 'var(--space-2)', 
          fontWeight: 600,
          color: 'var(--gray-400)'
        }}>
          Deep Safer
        </span>
        <img 
          src="/assets/deepsafer.png" 
          alt="logo" 
          width="45px" 
          style={{ 
            borderRadius: 'var(--radius-sm)',
            marginLeft: 'var(--space-2)'
          }}
        />
      </div>
    </div>
  );
};

export default TopControlPanel;