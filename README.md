# Raven Cyber Threat Map

Raven Cyber Threat Map is a modern React web application for visualizing global cyber threat activity on an interactive map. It provides real-time attack simulation, IP lookup, and threat intelligence features.

![Raven Cyber Threat Map Screenshot](/assets/RavenCyberThreatMap.png)

---

## Features

- 🌍 Interactive world map visualization (D3 + TopoJSON)
- 🔎 IP geolocation & threat intelligence panel
- ⚡ Live attack simulation & random threat data
- 📊 Displays cyber threat data from JSON sources
- 📱 Responsive UI built with React
- 🗂 Modular component-based architecture
- 🛠 Easy to extend with new threat sources or panels

---

## Project Structure

```
node_modules/
public/
  ├─ assets/
  ├─ countries-110m.json
  └─ data.json
src/
  ├─ components/
  │    ├─ CountryStatsPanel.jsx
  │    ├─ CustomizationPanel.jsx
  │    ├─ IPLookupPanel.jsx
  │    ├─ LiveAttacksPanel.jsx
  │    ├─ RandomDataPanel.jsx
  │    ├─ ThreatMap.jsx
  │    └─ TopControlPanel.jsx
  ├─ data/
  │    └─ countries.js
  ├─ stores/
  │    └─ useAppStore.js
  ├─ utils/
  │    ├─ attackGenerator.js
  │    └─ statsCalculator.js
  ├─ App.css
  ├─ App.jsx
  ├─ main.jsx
index.html
package-lock.json
package.json
README.md
vite.config.js
```

---

## File Overview

- **public/**: Static assets & data files
  - **assets/**: Images and icons
  - **countries-110m.json**: World map TopoJSON data
  - **data.json**: Sample cyber threat data
- **src/**: Source code
  - **components/**: UI panels & map visualization
    - **CountryStatsPanel.jsx**: Country-specific threat stats
    - **CustomizationPanel.jsx**: Map and UI customization
    - **IPLookupPanel.jsx**: IP geolocation and threat intelligence
    - **LiveAttacksPanel.jsx**: Real-time attack simulation
    - **RandomDataPanel.jsx**: Random threat data generator
    - **ThreatMap.jsx**: D3/TopoJSON map visualization
    - **TopControlPanel.jsx**: Controls and filters
  - **data/countries.js**: Country data utilities
  - **stores/useAppStore.js**: Global state management
  - **utils/attackGenerator.js**: Attack simulation logic
  - **utils/statsCalculator.js**: Threat statistics calculations
  - **App.jsx**: Main React app component
  - **App.css**: Global styles
  - **main.jsx**: Entry point
- **index.html**: HTML template
- **package.json**: Project dependencies and scripts
- **package-lock.json**: Dependency lock file
- **vite.config.js**: Vite build configuration
- **README.md**: Project documentation

---

## Technologies Used

- [React](https://react.dev/)
- [D3.js](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/raven-cyber-threat-map.git
   cd raven-cyber-threat-map
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App (Development)

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```sh
npm run build
# or
yarn build
```

### Preview Production Build

```sh
npm run preview
# or
yarn preview
```

The production build will be available in the `dist` folder.

---

## Usage

- **ThreatMap**: View global cyber threats on an interactive map.
- **IPLookupPanel**: Enter an IP address to get geolocation and threat info.
- **LiveAttacksPanel**: Watch simulated real-time cyber attacks.
- **RandomDataPanel**: Generate and view random threat data.
- **TopControlPanel**: Filter and control the map display.
- **CountryStatsPanel**: See stats for selected countries.
- **CustomizationPanel**: Customize map and UI settings.

---

## Data Sources

- **countries-110m.json**: World map boundaries (Natural Earth)
- **data.json**: Example threat events (customizable)
- **src/data/countries.js**: Country metadata

---

## Scripts

- `npm run dev` / `yarn dev`: Start development server
- `npm run build` / `yarn build`: Build for production
- `npm run preview` / `yarn preview`: Preview production build

---

## License

MIT License

---

## Acknowledgements

- World map data from [Natural Earth](https://www.naturalearthdata.com/)
- D3.js and TopoJSON for map visualization

---

_Cyber Threat Map – Visualize and analyze cyber attacks in real-time._
