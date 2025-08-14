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
