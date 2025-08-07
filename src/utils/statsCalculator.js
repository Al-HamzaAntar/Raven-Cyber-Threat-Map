// Utility functions for calculating attack statistics
export const calculateCountryStats = (attacks) => {
  const stats = {};
  
  attacks.forEach(attack => {
    // Count source country attacks
    if (attack.source && attack.source.countryCode) {
      const sourceCode = attack.source.countryCode;
      if (!stats[sourceCode]) {
        stats[sourceCode] = {
          code: sourceCode,
          name: attack.source.country,
          count: 0,
          sourceCount: 0,
          targetCount: 0
        };
      }
      stats[sourceCode].count++;
      stats[sourceCode].sourceCount++;
    }
    
    // Count target country attacks
    if (attack.target && attack.target.countryCode) {
      const targetCode = attack.target.countryCode;
      if (!stats[targetCode]) {
        stats[targetCode] = {
          code: targetCode,
          name: attack.target.country,
          count: 0,
          sourceCount: 0,
          targetCount: 0
        };
      }
      stats[targetCode].count++;
      stats[targetCode].targetCount++;
    }
  });
  
  return stats;
};

export const calculateThreatTypeStats = (attacks) => {
  const stats = {};
  
  attacks.forEach(attack => {
    const type = attack.type || 'unknown';
    if (!stats[type]) {
      stats[type] = 0;
    }
    stats[type]++;
  });
  
  return stats;
};

export const calculateTimeBasedStats = (attacks, timeWindow = 3600000) => { // 1 hour default
  const now = Date.now();
  const recentAttacks = attacks.filter(attack => 
    (now - attack.timestamp) < timeWindow
  );
  
  return {
    totalAttacks: attacks.length,
    recentAttacks: recentAttacks.length,
    attacksPerMinute: recentAttacks.length / (timeWindow / 60000)
  };
};

export const getTopCountries = (stats, limit = 10) => {
  return Object.values(stats)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getTopThreatTypes = (stats, limit = 5) => {
  return Object.entries(stats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([type, count]) => ({ type, count }));
};
