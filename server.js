// server.js - 3D Printer Simulation Server

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// 3D Printer state
let printerState = {
  status: 'idle', // idle, printing, paused, error
  progress: 0,    // 0-100%
  temperature: {
    hotend: 25,   // in °C
    bed: 25       // in °C
  },
  jobName: '',
  estimatedTime: 0,
  elapsedTime: 0,
  remainingTime: 0,
  filamentUsed: 0,
  layerHeight: 0.2,
  currentLayer: 0,
  totalLayers: 0,
  error: null
};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send current printer state to the newly connected client
  socket.emit('printerState', printerState);
  
  // Handle print job start
  socket.on('startPrint', (jobData) => {
    if (printerState.status === 'idle') {
      printerState = {
        ...printerState,
        status: 'printing',
        progress: 0,
        jobName: jobData.name || 'Unnamed Job',
        estimatedTime: jobData.estimatedTime || 3600, // default 1 hour
        elapsedTime: 0,
        remainingTime: jobData.estimatedTime || 3600,
        filamentUsed: 0,
        totalLayers: jobData.totalLayers || 100,
        currentLayer: 0,
        error: null
      };
      
      // Start heating simulation
      simulateHeating();
      
      // Broadcast updated state to all clients
      io.emit('printerState', printerState);
      console.log('Print job started:', printerState.jobName);
    } else {
      socket.emit('error', { message: 'Printer is busy' });
    }
  });
  
  // Handle print job pause
  socket.on('pausePrint', () => {
    if (printerState.status === 'printing') {
      printerState.status = 'paused';
      io.emit('printerState', printerState);
      console.log('Print job paused');
    }
  });
  
  // Handle print job resume
  socket.on('resumePrint', () => {
    if (printerState.status === 'paused') {
      printerState.status = 'printing';
      io.emit('printerState', printerState);
      console.log('Print job resumed');
    }
  });
  
  // Handle print job cancel
  socket.on('cancelPrint', () => {
    if (printerState.status === 'printing' || printerState.status === 'paused') {
      simulateCooling();
      printerState = {
        ...printerState,
        status: 'idle',
        progress: 0,
        jobName: '',
        elapsedTime: 0,
        remainingTime: 0,
        filamentUsed: 0,
        currentLayer: 0,
        error: null
      };
      io.emit('printerState', printerState);
      console.log('Print job canceled');
    }
  });
  
  // Handle manual temperature setting
  socket.on('setTemperature', (tempData) => {
    printerState.temperature = {
      ...printerState.temperature,
      ...tempData
    };
    io.emit('printerState', printerState);
    console.log('Temperature set:', printerState.temperature);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate printer heating process
function simulateHeating() {
  const heatingInterval = setInterval(() => {
    // Simulate hotend heating (target: 200°C)
    if (printerState.temperature.hotend < 200) {
      printerState.temperature.hotend += 5;
      if (printerState.temperature.hotend > 200) printerState.temperature.hotend = 200;
    }
    
    // Simulate bed heating (target: 60°C)
    if (printerState.temperature.bed < 60) {
      printerState.temperature.bed += 2;
      if (printerState.temperature.bed > 60) printerState.temperature.bed = 60;
    }
    
    io.emit('printerState', printerState);
    
    // Once target temperatures are reached, start the print simulation
    if (printerState.temperature.hotend >= 200 && printerState.temperature.bed >= 60) {
      clearInterval(heatingInterval);
      simulatePrinting();
    }
  }, 1000);
}

// Simulate printer cooling process
function simulateCooling() {
  const coolingInterval = setInterval(() => {
    let isCooling = false;
    
    // Simulate hotend cooling
    if (printerState.temperature.hotend > 25) {
      printerState.temperature.hotend -= 3;
      if (printerState.temperature.hotend < 25) printerState.temperature.hotend = 25;
      isCooling = true;
    }
    
    // Simulate bed cooling
    if (printerState.temperature.bed > 25) {
      printerState.temperature.bed -= 1;
      if (printerState.temperature.bed < 25) printerState.temperature.bed = 25;
      isCooling = true;
    }
    
    io.emit('printerState', printerState);
    
    // Stop cooling simulation when both hotend and bed are at room temperature
    if (!isCooling) {
      clearInterval(coolingInterval);
    }
  }, 1000);
}

// Simulate the printing process
function simulatePrinting() {
  const printInterval = setInterval(() => {
    if (printerState.status === 'printing') {
      // Update progress
      printerState.progress += 0.1;
      if (printerState.progress > 100) printerState.progress = 100;
      
      // Update time
      printerState.elapsedTime += 1;
      printerState.remainingTime = Math.max(0, printerState.estimatedTime - printerState.elapsedTime);
      
      // Update filament used (just a simple simulation)
      printerState.filamentUsed += 0.05; // in meters
      
      // Update layers
      printerState.currentLayer = Math.floor((printerState.progress / 100) * printerState.totalLayers);
      
      io.emit('printerState', printerState);
      
      // When print is complete
      if (printerState.progress >= 100) {
        printerState.status = 'idle';
        printerState.progress = 100;
        printerState.remainingTime = 0;
        io.emit('printerState', printerState);
        clearInterval(printInterval);
        simulateCooling();
        console.log('Print job completed');
      }
    }
  }, 1000);
}

// Random error simulation (optional)
function simulateRandomError() {
  if (printerState.status === 'printing' && Math.random() < 0.001) { // 0.1% chance of error per check
    const errorTypes = [
      'Filament runout detected',
      'Nozzle jam detected',
      'Power fluctuation detected',
      'Thermal runaway prevented',
      'Motion system error'
    ];
    
    printerState.status = 'error';
    printerState.error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    io.emit('printerState', printerState);
    console.log('Printer error:', printerState.error);
  }
}

// API Routes
app.get('/api/printer', (req, res) => {
  res.json(printerState);
});

// Default route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(3D Printer Simulation Server running on port ${PORT});
});