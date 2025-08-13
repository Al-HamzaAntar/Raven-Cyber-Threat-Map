import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { calculateCountryStats } from '../utils/statsCalculator.js';

 const useAppStore = create(
  devtools(
    (set, get) => ({
      // UI State
      theme: 'dark',
      mode: 'live',
      showIPLookup: false,
      showRandomData: false,
      showLiveAttacks: true,
      
      // Attack Data
      attacks: [],
      selectedAttack: null,
      countryStats: {},
      
      // Customizations
      customizations: {},
      
      // Actions
      setTheme: (theme) => set({ theme }, false, 'setTheme'),
      
      setMode: (mode) => set({ mode }, false, 'setMode'),
      
      setShowIPLookup: (show) => set({ showIPLookup: show }, false, 'setShowIPLookup'),
      
      setShowRandomData: (show) => set({ showRandomData: show }, false, 'setShowRandomData'),
      
      setShowLiveAttacks: (show) => set({ showLiveAttacks: show }, false, 'setShowLiveAttacks'),
      
      setSelectedAttack: (attack) => set({ selectedAttack: attack }, false, 'setSelectedAttack'),
      
      addAttack: (attack) => set((state) => {
        const newAttacks = [...state.attacks.slice(-999), attack]; // Keep last 1000
        const newStats = calculateCountryStats(newAttacks);
        return {
          attacks: newAttacks,
          countryStats: newStats,
          selectedAttack: attack
        };
      }, false, 'addAttack'),
      
      addMultipleAttacks: (attacksToAdd) => set((state) => {
        const newAttacks = [...state.attacks, ...attacksToAdd].slice(-999);
        const newStats = calculateCountryStats(newAttacks);
        return {
          attacks: newAttacks,
          countryStats: newStats
        };
      }, false, 'addMultipleAttacks'),
      
      clearAttacks: () => set({ 
        attacks: [], 
        countryStats: {},
        selectedAttack: null 
      }, false, 'clearAttacks'),
      
      setCustomizations: (customizations) => set({ customizations }, false, 'setCustomizations'),
      
      updateCustomization: (countryCode, color) => set((state) => ({
        customizations: {
          ...state.customizations,
          [countryCode]: color
        }
      }), false, 'updateCustomization'),
      
      removeCustomization: (countryCode) => set((state) => {
        const { [countryCode]: removed, ...rest } = state.customizations;
        return { customizations: rest };
      }, false, 'removeCustomization'),
      
      // Computed values
      getAttacksByType: () => {
        const { attacks } = get();
        return attacks.reduce((acc, attack) => {
          acc[attack.type] = (acc[attack.type] || 0) + 1;
          return acc;
        }, {});
      },
      
      getRecentAttacks: (limit = 10) => {
        const { attacks } = get();
        return attacks.slice(-limit).reverse();
      },
      
      getAttacksByCountry: () => {
        const { attacks } = get();
        return attacks.reduce((acc, attack) => {
          const targetCountry = attack.target.country;
          acc[targetCountry] = (acc[targetCountry] || 0) + 1;
          return acc;
        }, {});
      }
    }),
    {
      name: 'raven-threat-map-store',
    }
  )
);

export default useAppStore;
