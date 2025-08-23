import React, { useState } from 'react';
import { countries, getAllCities } from '../data/countries.js';
import useAppStore from '../stores/useAppStore.js';

const CustomizationPanel = ({ theme }) => {
  const { customizations, updateCustomization, removeCustomization } = useAppStore();
  
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCity, setSelectedCity] = useState('');
  const [color, setColor] = useState('#6b09ea');
  const [customizationType, setCustomizationType] = useState('country'); // 'country' or 'city'

  const handleApply = () => {
    const key = customizationType === 'country' ? selectedCountry : `city_${selectedCity}`;
    updateCustomization(key, color);
  };

  const handleRemove = () => {
    const key = customizationType === 'country' ? selectedCountry : `city_${selectedCity}`;
    removeCustomization(key);
  };

  const getCitiesForCountry = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.cities : [];
  };

  const getCurrentCustomization = () => {
    const key = customizationType === 'country' ? selectedCountry : `city_${selectedCity}`;
    return customizations[key];
  };

  return (
    <div className={`panel customization-panel theme-${theme}`} style={{
      position: 'absolute',
      right: '2vw',
      top: '12vh',
      width: 320,
      zIndex: 5
    }}>
      <div className="panel-title">Advanced Customization</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <label>
          Customization Type:
          <select 
            value={customizationType} 
            onChange={e => setCustomizationType(e.target.value)}
            style={{marginLeft:8}}
          >
            <option value="country">Country</option>
            <option value="city">City</option>
          </select>
        </label>
        
        {customizationType === 'country' ? (
          <label>
            Country:
            <select 
              value={selectedCountry} 
              onChange={e => setSelectedCountry(e.target.value)}
              style={{marginLeft:0, width: '100%'}}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            City:
            <select 
              value={selectedCity} 
              onChange={e => setSelectedCity(e.target.value)}
              style={{marginLeft:8}}
            >
              <option value="">Select a city...</option>
              {getAllCities().map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>
        )}
        
        <label>
          Highlight Color:
          <input 
            type="color" 
            value={color} 
            onChange={e => setColor(e.target.value)} 
            style={{marginLeft:8}} 
          />
        </label>
        
        {getCurrentCustomization() && (
          <div style={{
            padding: '8px',
            background: theme === 'dark' ? '#333' : '#f0f0f0',
            borderRadius: '4px',
            fontSize: '0.9em',
            color: theme === 'dark' ? '#fff' : '#000',
          }}>
            Current: <span style={{color: getCurrentCustomization()}}>
              {getCurrentCustomization()}
            </span>
          </div>
        )}
        
        <div style={{display: 'flex', gap: '8px'}}>
          <button onClick={handleApply} style={{flex: 1}}>
            Apply {customizationType === 'country' ? 'Country' : 'City'} Customization
          </button>
          {getCurrentCustomization() && (
            <button onClick={handleRemove} style={{
              background: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Remove
            </button>
          )}
        </div>
        
        {Object.keys(customizations).length > 0 && (
          <div style={{marginTop: '16px'}}>
            <div style={{fontSize: '0.9em', marginBottom: '8px'}}>Active Customizations:</div>
            <div style={{maxHeight: '120px', overflowY: 'auto'}}>
              {Object.entries(customizations).map(([key, color]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 8px',
                  margin: '2px 0',
                  background: theme === 'dark' ? '#333' : '#f0f0f0',
                  color: theme === 'dark' ? '#fff' : '#000',
                  borderRadius: '4px',
                  fontSize: '0.8em'
                }}>
                  <span>{key.startsWith('city_') ? key.replace('city_', '') : key}</span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    borderRadius: '3px',
                    border: '1px solid #666'
                  }}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationPanel;
