// DOM elements
const extruderTempElement = document.getElementById('extruderTemp');
const bedTempElement = document.getElementById('bedTemp');
const piTempElement = document.getElementById('piTempValue');
const ambientTempElement = document.getElementById('ambientTemp');
const humidityElement = document.getElementById('humidity');
const piHeaderTempElement = document.getElementById('piTemp');
const currentTimeElement = document.getElementById('currentTime');
const printerStatusElement = document.getElementById('printerStatus');
const progressBarElement = document.getElementById('progressFill');
const progressTextElement = document.getElementById('progressText');
const extruderBarElement = document.getElementById('extruderBar');
const bedBarElement = document.getElementById('bedBar');
const piBarElement = document.getElementById('piBar');

// Temperature chart setup
const ctx = document.getElementById('temperatureChart').getContext('2d');
const temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(30).fill(''),
        datasets: [
            {
                label: 'Extruder',
                data: Array(30).fill(null),
                borderColor: '#ff7b00',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            },
            {
                label: 'Bed',
                data: Array(30).fill(null),
                borderColor: '#00c3ff',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            },
            {
                label: 'Pi',
                data: Array(30).fill(null),
                borderColor: '#ff00c3',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            }
        ]
    },
    options: {
        maintainAspectRatio: false,
        animation: {
            duration: 300
        },
        scales: {
            y: {
                min: 20,
                max: 50,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    font: {
                        size: 10
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    }
});

// Update time function
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}`;
}

// Simulate temperature data
function getRandomTemp(min, max, current = null) {
    if (current === null) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        // Add small random fluctuation to current value
        const fluctuation = Math.random() * 0.6 - 0.3; // -0.3 to +0.3
        let newTemp = current + fluctuation;
        // Keep within bounds
        if (newTemp < min) newTemp = min;
        if (newTemp > max) newTemp = max;
        return parseFloat(newTemp.toFixed(1));
    }
}

// Simulate printer status
function getRandomStatus() {
    const statuses = ['Printing', 'Idle', 'Heating', 'Preparing', 'Cooling'];
    const randomIndex = Math.floor(Math.random() * 100) % statuses.length;
    return statuses[randomIndex];
}

// Update chart with new data
function updateChart(extruderTemp, bedTemp, piTemp) {
    temperatureChart.data.datasets[0].data.shift();
    temperatureChart.data.datasets[0].data.push(extruderTemp);
    
    temperatureChart.data.datasets[1].data.shift();
    temperatureChart.data.datasets[1].data.push(bedTemp);
    
    temperatureChart.data.datasets[2].data.shift();
    temperatureChart.data.datasets[2].data.push(piTemp);
    
    temperatureChart.update();
}

// Initialize with random values
let extruderTemp = getRandomTemp(20, 250);
let bedTemp = getRandomTemp(20, 80);
let piTemp = getRandomTemp(35, 60);
let ambientTemp = getRandomTemp(18, 25);
let humidity = getRandomTemp(20, 30);
let progress = Math.floor(Math.random() * 101); // 0-100
let status = getRandomStatus();

// Initial update
function updateUI() {
    // Update temperatures
    extruderTempElement.textContent = extruderTemp;
    bedTempElement.textContent = bedTemp;
    piTempElement.textContent = piTemp;
    piHeaderTempElement.textContent = `${piTemp}°`;
    ambientTempElement.textContent = `${ambientTemp}°`;
    humidityElement.textContent = `${humidity}°`;
    
    // Update progress
    progressBarElement.style.width = `${progress}%`;
    progressTextElement.textContent = `${progress}%`;
    
    // Update temperature bars
    extruderBarElement.style.width = `${(extruderTemp / 250) * 100}%`;
    bedBarElement.style.width = `${(bedTemp / 80) * 100}%`;
    piBarElement.style.width = `${((piTemp - 30) / 30) * 100}%`;
    
    // Update status
    printerStatusElement.textContent = status;
    
    // Update chart
    updateChart(extruderTemp, bedTemp, piTemp);
    
    // Update time every second
    updateTime();
}

// Simulate polling an API
function fetchPrinterData() {
    // In a real application, this would be a fetch request to your backend API
    // Here we'll just simulate data changes
    
    // Simulate temperature fluctuations
    extruderTemp = getRandomTemp(20, 250, extruderTemp);
    bedTemp = getRandomTemp(20, 80, bedTemp);
    piTemp = getRandomTemp(35, 60, piTemp);
    ambientTemp = getRandomTemp(18, 25, ambientTemp);
    humidity = getRandomTemp(20, 30, humidity);
    
    // Random chance to change status
    if (Math.random() < 0.05) {
        status = getRandomStatus();
    }
    
    // Simulate progress update (slightly increasing if in printing status)
    if (status === 'Printing') {
        progress += Math.random() * 2;
        if (progress > 100) {
            progress = 100;
            // Random chance to complete print and reset
            if (Math.random() < 0.2) {
                progress = 0;
                status = 'Idle';
            }
        }
    }
    
    // Update UI with new data
    updateUI();
}

// Initial update
updateUI();

// Set up polling interval
setInterval(fetchPrinterData, 1000);