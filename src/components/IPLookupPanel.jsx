import React, { useState } from 'react';

const IPLookupPanel = () => {
  const [input, setInput] = useState('');
  return (
    <div className="panel ip-lookup-panel">
      <div className="panel-title">Check IP or Mobile</div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <input
          type="text"
          placeholder="IP or Mobile (E.g. 0.0.0.0 or +1425...)"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{flex:1}}
        />
        <button>Check</button>
      </div>
    </div>
  );
};

export default IPLookupPanel;