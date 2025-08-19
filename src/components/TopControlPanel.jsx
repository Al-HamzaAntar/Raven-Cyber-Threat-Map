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
      <button title="List" onClick={handleListClick} style={{color: '#6b09ea'}}><span><TiThMenu /></span></button>
      <button title="Replay" onClick={handleReplayClick} style={{color: '#6b09ea'}}><span><GrRefresh /></span></button>
      <button title="Live" onClick={handleLiveClick} style={{color: '#6b09ea'}}><span><HiOutlineSwitchHorizontal /></span></button>
      <button title="Check IP or Mobile" onClick={handlePenClick} style={{color: '#6b09ea'}}><span role="img" aria-label="pen"><FaPen /></span></button>
      <button title="Theme: Dark" onClick={() => setTheme('dark')}><span><BsMoonFill /></span></button>
      <button title="Theme: Light" onClick={() => setTheme('light')}><span><ImSun /></span></button>
      <button title="Theme: Custom" onClick={() => setTheme('custom')}><span style={{background:'#6b09ea',width:16,height:16,display:'inline-block',borderRadius:4}}></span></button>
      <div style={{display:'flex', alignItems:'center', gap:8, marginLeft: 10}}>
      <span style={{marginLeft:8, fontWeight:600}}>Deep Safer</span>
      <img src="/assets/deepsafer.png" alt="logo" width={'30px'} style={{borderRadius:4}}/>
      </div>
    </div>
  );
};

export default TopControlPanel;