import React from 'react';

const CountryStatsPanel = ({ stats }) => {
  const sorted = Object.values(stats || {}).sort((a, b) => b.count - a.count);
  return (
    <div className="panel country-stats-panel" style={{position:'absolute',right:'2vw',bottom:'2vh',width:320,maxHeight:320,overflowY:'auto',zIndex:5}}>
      <div className="panel-title">Attack Statistics per Country</div>
      <table className="live-attacks-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>Code</th>
            <th>Attacks</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={row.code}>
              <td>{row.name}</td>
              <td><span className="country-code">{row.code}</span></td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountryStatsPanel;
