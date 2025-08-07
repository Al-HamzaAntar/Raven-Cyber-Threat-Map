import React, { useState } from 'react';
import { countries, getAllCities } from '../data/countries.js';

const CustomizationPanel = ({ onCustomize }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCity, setSelectedCity] = useState('');
  const [color, setColor] = useState('#7ec3fa');
  const [customizationType, setCustomizationType] = useState('country'); // 'country' or 'city'

  const handleApply = () => {
    if (onCustomize) {
      const customization = {
        type: customizationType,
        value: customizationType === 'country' ? selectedCountry : selectedCity,
        color
      };
      onCustomize(customization);
    }
  };

  const getCitiesForCountry = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.cities : [];
  };

  return (
    <div className="panel customization-panel" style={{position:'absolute',right:'2vw',top:'12vh',width:320,zIndex:5}}>
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
              style={{marginLeft:8}}
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
        
        <button onClick={handleApply}>
          Apply {customizationType === 'country' ? 'Country' : 'City'} Customization
        </button>
      </div>
    </div>
  );
};

export default CustomizationPanel;
