# 3D-printer-dashboard
Implemented a web-based dashboard that simulates real-time  monitoring of a 3D printer

A web-based dashboard that simulates real-time monitoring of a 3D printer. This project includes both a frontend for visualizing data and a backend API for generating mock printer data.

## Features

- Real-time temperature monitoring for Extruder, Heater Bed, and Pi
- Live updating line graph showing temperature history
- Print job progress tracking
- Printer status display
- Responsive design that works on both desktop and mobile
- Mock API that simulates real printer behavior

## Tech Stack

- **Frontend:**
  - HTML5, CSS3, JavaScript
  - Chart.js for temperature visualization
  - Responsive design with media queries

- **Backend:**
  - Node.js with Express
  - RESTful API endpoints

## Setup Instructions

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/3d-printer-dashboard.git
   cd 3d-printer-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create the directory structure:
   ```
   mkdir -p public
   ```

4. Copy the frontend files (index.html, styles.css, script.js) to the `public` directory.

### Running the Application

1. Start the server:
   ```
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /api/printer/status` - Get current printer status and temperatures
- `GET /api/printer/temperature-history` - Get temperature history for graphing
- `POST /api/printer/control/home` - Simulate homing the printer
- `POST /api/printer/control/temperature` - Simulate temperature control
- `POST /api/printer/control/print` - Simulate starting a print job

## Design Decisions

1. **Real-time Updates:**
   - Used polling at 1-second intervals to simulate real-time data updates
   - In a production environment, WebSockets would be preferable for true real-time communication

2. **Temperature Fluctuations:**
   - Implemented small random fluctuations to simulate real temperature readings
   - Added constraints to keep temperatures within realistic ranges

3. **Mobile Responsiveness:**
   - Used CSS flex layouts and media queries to ensure the dashboard is usable on mobile devices
   - Adjusted font sizes and spacing for smaller screens

4. **Visual Design:**
   - Used a dark theme similar to common 3D printer interfaces
   - Color-coded temperature indicators for quick visual distinction
   - Implemented a minimalist design focusing on important information

## Challenges and Solutions

1. **Challenge:** Creating realistic temperature fluctuations
   - **Solution:** Implemented a function that adds small random variations to current temperatures while keeping them within realistic bounds

2. **Challenge:** Maintaining responsive layout across device sizes
   - **Solution:** Used CSS flex layouts and media queries to adjust the interface elements based on screen size

3. **Challenge:** Simulating printer behavior realistically
   - **Solution:** Added state transitions and progress changes that mimic real printer behavior (heating, printing, cooling cycles)

4. **Challenge:** Optimizing chart performance
   - **Solution:** Limited history data points and disabled unnecessary chart.js features to improve rendering performance

## Future Enhancements

- Add authentication for printer control
- Implement WebSockets for more efficient real-time updates
- Add file upload functionality for G-code files
- Implement print queue management
- Add webcam integration for visual monitoring
- Create printable history logs
- Add notifications for print completion or errors

## Screencap Videos

To see the dashboard in action, please refer to the video capture in the submission package.
