import React from 'react';

const LiveAttacksPanel = ({ attacks = [] }) => {
  return (
    <div className="panel live-attacks-panel">
      <div className="panel-title">Live Attacks</div>
      <table className="live-attacks-table">
        <tbody>
          {attacks.slice(-10).reverse().map((atk, i) => (
            <tr key={i}>
              <td style={{fontSize:'0.92em',color:'#aaa'}}>{new Date(atk.timestamp).toISOString()}</td>
              <td><span className="country-code">{atk.source.countryCode || '--'}</span></td>
              <td>
                {atk.source.city && <div>City: {atk.source.city}</div>}
                {atk.source.ip && <div>IP: {atk.source.ip}</div>}
                <div>Country: {atk.source.country}</div>
                {atk.source.port && <div>Port: {atk.source.port}</div>}
              </td>
              <td className="arrow">→</td>
              <td><span className="country-code">{atk.target.countryCode || '--'}</span></td>
              <td>
                {atk.target.city && <div>City: {atk.target.city}</div>}
                {atk.target.ip && <div>IP: {atk.target.ip}</div>}
                <div>Country: {atk.target.country}</div>
                {atk.target.port && <div>Port: {atk.target.port}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveAttacksPanel;