import React, { useState } from 'react';

const dataTypes = ['Countries', 'Cities', 'IPs', 'Coordinates'];

const RandomDataPanel = ({ onGenerate }) => {
  const [attacks, setAttacks] = useState(10);
  const [time, setTime] = useState(5000);
  const [delay, setDelay] = useState(500);
  const [selected, setSelected] = useState({
    Countries: true,
    Cities: true,
    IPs: true,
    Coordinates: true,
  });

  const handleToggle = (type) => {
    setSelected(s => ({ ...s, [type]: !s[type] }));
  };

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate({
        attacks: Number(attacks),
        time: Number(time),
        delay: Number(delay),
        selected,
      });
    }
  };

  return (
    <div className="panel random-data-panel">
      <div className="panel-title">Generate Random Data</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}}>
        <input
          type="number"
          min={1}
          value={attacks}
          onChange={e => setAttacks(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Attacks"
          style={{width:60}}
        />
        <input
          type="number"
          min={0}
          value={time}
          onChange={e => setTime(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Time (ms)"
          style={{width:80}}
        />
        <input
          type="number"
          min={0}
          value={delay}
          onChange={e => setDelay(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="Delay (ms)"
          style={{width:80}}
        />
        {dataTypes.map(type => (
          <button
            key={type}
            onClick={() => handleToggle(type)}
            style={{
              background: selected[type] ? '#7ec3fa' : '#232526',
              color: selected[type] ? '#232526' : '#7ec3fa',
              border: selected[type] ? '1.5px solid #7ec3fa' : '1px solid #444',
              fontWeight: selected[type] ? 700 : 500,
            }}
          >
            {type}
          </button>
        ))}
        <button onClick={handleGenerate}>Generate</button>
      </div>
    </div>
  );
};

export default RandomDataPanel;