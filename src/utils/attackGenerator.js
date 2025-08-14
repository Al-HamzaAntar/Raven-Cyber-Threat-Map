import { getRandomCountry, getRandomCity } from '../data/countries.js';

// Utility functions for generating random attack data
export const generateRandomIP = () => {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 255)).join('.');
};

export const generateRandomPort = () => {
  return Math.floor(Math.random() * 65535);
};

export const generateRandomThreatType = () => {
  const threatTypes = ['malware', 'phishing', 'ddos', 'ransomware', 'spyware', 'trojan'];
  return threatTypes[Math.floor(Math.random() * threatTypes.length)];
};

export const generateRandomAttack = (config = {}) => {
  const {
    includeIPs = true,
    includePorts = true,
    includeCities = true,
    includeCountries = true
  } = config;

  const sourceCountry = getRandomCountry();
  let targetCountry = getRandomCountry();
  
  // Ensure source and target are different
  while (targetCountry.code === sourceCountry.code) {
    targetCountry = getRandomCountry();
  }

  const sourceCity = includeCities ? sourceCountry.cities[Math.floor(Math.random() * sourceCountry.cities.length)] : '';
  const targetCity = includeCities ? targetCountry.cities[Math.floor(Math.random() * targetCountry.cities.length)] : '';

  return {
    type: generateRandomThreatType(),
    source: {
      country: includeCountries ? sourceCountry.name : '',
      countryCode: includeCountries ? sourceCountry.code : '',
      city: sourceCity,
      lat: sourceCountry.lat,
      lon: sourceCountry.lon,
      ip: includeIPs ? generateRandomIP() : '',
      port: includePorts ? generateRandomPort() : ''
    },
    target: {
      country: includeCountries ? targetCountry.name : '',
      countryCode: includeCountries ? targetCountry.code : '',
      city: targetCity,
      lat: targetCountry.lat,
      lon: targetCountry.lon,
      ip: includeIPs ? generateRandomIP() : '',
      port: includePorts ? generateRandomPort() : ''
    },
    timestamp: Date.now()
  };
};

export const generateAttacksWithDelay = (count, delay, config = {}) => {
  const attacks = [];
  for (let i = 0; i < count; i++) {
    attacks.push({
      ...generateRandomAttack(config),
      timestamp: Date.now() + (i * delay)
    });
  }
  return attacks;
};
