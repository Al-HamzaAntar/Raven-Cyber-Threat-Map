import React from 'react';

const RandomDataPanel = () => {
  return (
    <div className="panel random-data-panel">
      <div className="panel-title">Generate Random Data</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}}>
        <input type="text" placeholder="Attacks" disabled style={{width:60}} />
        <input type="text" placeholder="Time (ms)" disabled style={{width:80}} />
        <input type="text" placeholder="Delay (ms)" disabled style={{width:80}} />
        <button>Countries</button>
        <button>Cities</button>
        <button>IPs</button>
        <button>Coordinates</button>
        <button>Generate</button>
      </div>
    </div>
  );
};

export default RandomDataPanel;