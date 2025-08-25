import React from 'react';
import useAppStore from '../stores/useAppStore.js';

const LiveAttacksPanel = ({ theme }) => {
  const { attacks, selectedAttack, setSelectedAttack, getRecentAttacks } = useAppStore();
  
  const recentAttacks = getRecentAttacks(10);

  return (
    <div className={`panel live-attacks-panel theme-${theme}`}>
      <div className="panel-title">Live Attacks ({attacks.length})</div>
      <div
        className="attacks-container"
        style={{ overflowX: 'auto', maxWidth: '100%' }} // <-- horizontal scroll enabled
      >
        {recentAttacks.length === 0 ? (
          <div className="no-attacks">No attacks detected yet</div>
        ) : (
          <table className="live-attacks-table">
            <tbody>
              {recentAttacks.map((atk, i) => (
                <tr 
                  key={`${atk.timestamp}-${i}`}
                  className={selectedAttack?.timestamp === atk.timestamp ? 'selected' : ''}
                  onClick={() => setSelectedAttack(atk)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{fontSize:'0.92em',color:'#aaa'}}>
                    {new Date(atk.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className="country-code">{atk.source.countryCode || '--'}</span>
                  </td>
                  <td>
                    {atk.source.city && <div>City: {atk.source.city}</div>}
                    {atk.source.ip && <div>IP: {atk.source.ip}</div>}
                    <div>Country: {atk.source.country}</div>
                    {atk.source.port && <div>Port: {atk.source.port}</div>}
                  </td>
                  <td className="arrow">→</td>
                  <td>
                    <span className="country-code">{atk.target.countryCode || '--'}</span>
                  </td>
                  <td>
                    {atk.target.city && <div>City: {atk.target.city}</div>}
                    {atk.target.ip && <div>IP: {atk.target.ip}</div>}
                    <div>Country: {atk.target.country}</div>
                    {atk.target.port && <div>Port: {atk.target.port}</div>}
                  </td>
                  <td className="attack-type">
                    <span className={`type-badge type-${atk.type}`}>
                      {atk.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LiveAttacksPanel;