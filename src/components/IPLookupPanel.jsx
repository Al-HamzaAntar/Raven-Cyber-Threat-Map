import React, { useState } from 'react';

const IPLookupPanel = () => {
  const [input, setInput] = useState('');
  const [info, setInfo] = useState(null);

  function checkIP(ip) {
    // Simple mock logic for demo
    if (!ip) return null;
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(ip)) {
      return {
        type: 'Private IP',
        software: 'software',
        port: 'lightweight directory access protocol',
        portnum: '389/tcp/udp'
      };
    }
    if (/^127\./.test(ip)) {
      return {
        type: 'Loopback',
        software: 'localhost',
        port: 'N/A',
        portnum: 'N/A'
      };
    }
    if (/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
      return {
        type: 'Public IP',
        software: 'Unknown',
        port: 'HTTP',
        portnum: '80/tcp'
      };
    }
    if (/^\+?\d{7,}/.test(ip)) {
      return {
        type: 'Mobile',
        software: 'SIM',
        port: 'SMS',
        portnum: 'N/A'
      };
    }
    return { type: 'Unknown', software: '-', port: '-', portnum: '-' };
  }

  const handleCheck = () => {
    setInfo(checkIP(input));
  };

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
        <button onClick={handleCheck}>Check</button>
      </div>
      {info && (
        <div style={{marginTop:12,background:'#181a1b',padding:'0.7em 1em',borderRadius:6,border:'1px solid #333'}}>
          <div><b>Type:</b> {info.type}</div>
          <div><b>Software:</b> {info.software}</div>
          <div><b>Port info:</b> {info.port} {info.portnum}</div>
        </div>
      )}
    </div>
  );
};

export default IPLookupPanel;