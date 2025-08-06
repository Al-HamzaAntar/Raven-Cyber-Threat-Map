# Raven Cyber Threat Map

Raven Cyber Threat Map is a React-based web application that visualizes global cyber threat data on an interactive map.

<img src="C:\Users\pc\Desktop\Raven-Cyber-Threat-Map\public\assets\RavenCyberThreatMap.png" alt="Raven CyberThreat Map" />



## Features

- Interactive world map visualization using D3 and TopoJSON
- Displays cyber threat data from JSON files
- Responsive UI built with React

## Project Structure

```
index.html
package.json
vite.config.js
public/
  countries-110m.json
  data.json
  Raven Cyber Threat Map.png
src/
  App.jsx
  main.jsx
  components/
    ThreatMap.jsx
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/raven-cyber-threat-map.git
   cd raven-cyber-threat-map
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Development Server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

### Building for Production

```sh
npm run build
```

The production build will be in the `dist` folder.

## Technologies Used

- [React](https://react.dev/)
- [D3.js](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson)
- [Vite](https://vitejs.dev/)

## License

This project is licensed under the MIT License.

## Acknowledgements

- World map data from [Natural Earth](https://www.naturalearthdata.com/)
