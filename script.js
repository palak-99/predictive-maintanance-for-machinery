let ctx = document.getElementById('dataGraph').getContext('2d');

let timeData = [];  
let featureData = {}; 

const features = [
    "time", "pwm", "rpm", "current_mA", "power_mW", "bus_v",
    "shunt_mV", "load_v", "x_axis_vib", "y_axis_vib", "z_axis_vib", 
    "magnitude", "vib_intensity"
];

features.forEach(feature => {
    featureData[feature] = [];
});

function checkFaults() {
    const inputs = {
        time: document.getElementById('time').value,
        pwm: document.getElementById('pwm').value,
        rpm: document.getElementById('rpm').value,
        current_mA: document.getElementById('current_mA').value,
        power_mW: document.getElementById('power_mW').value,
        bus_v: document.getElementById('bus_v').value,
        shunt_mV: document.getElementById('shunt_mV').value,
        load_v: document.getElementById('load_v').value,
        x_axis_vib: document.getElementById('x_axis_vib').value,
        y_axis_vib: document.getElementById('y_axis_vib').value,
        z_axis_vib: document.getElementById('z_axis_vib').value,
        magnitude: document.getElementById('magnitude').value,
        vib_intensity: document.getElementById('vib_intensity').value
    };

    const limits = {
        time: [190.917, 4571.553],
        pwm: [100.0, 250.0],
        rpm: [173.09, 2791.25],
        current_mA: [14.958, 80.868],
        power_mW: [7.815, 262.292],
        bus_v: [0.475, 4.838],
        shunt_mV: [1.451, 8.138],
        load_v: [0.476, 4.841],
        x_axis_vib: [10.227, 13.196],
        y_axis_vib: [3.151, 9.311],
        z_axis_vib: [2.443, 3.001],
        magnitude: [11.259, 16.161],
        vib_intensity: [0.0, 100.0]
    };

    let faults = [];
    let dataValues = [];

    for (const feature in inputs) {
        const value = parseFloat(inputs[feature]);
        const [min, max] = limits[feature];
        if (value < min || value > max) {
            faults.push(`${feature} is out of range! (Value: ${value}, Expected: ${min} to ${max})`);
        }
        dataValues.push(value);  
        if (feature !== "time") {
            featureData[feature].push(value);
        }
    }

    timeData.push(parseFloat(inputs.time));

    const resultDiv = document.getElementById('result');
    if (faults.length > 0) {
        resultDiv.innerHTML = `<div class="fault"><h3>Faults Detected:</h3><ul><li>${faults.join('</li><li>')}</li></ul></div>`;
    } else {
        resultDiv.innerHTML = '<div class="no-fault"><h3>No faults detected. All values are within acceptable limits.</h3></div>';
    }

    drawGraph(timeData, featureData);
}

function drawGraph(timeData, featureData) {
    const datasets = [];

    for (const feature in featureData) {
        if (featureData[feature].length > 0) {
            datasets.push({
                label: feature.charAt(0).toUpperCase() + feature.slice(1),
                data: featureData[feature],
                borderColor: getRandomColor(),
                backgroundColor: getRandomColor(0.2),
                fill: false, 
                tension: 0.2,  
                pointRadius: 3,  
                borderWidth: 2
            });
        }
    }

    const data = {
        labels: timeData,  
        datasets: datasets
    };

    const config = {
        type: 'line', 
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Time (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Feature Value'
                    },
                    suggestedMin: 0,
                    suggestedMax: 120
                }
            }
        }
    };

    if (window.myChart) {
        window.myChart.data.datasets = datasets;
        window.myChart.update();
    } else {
        window.myChart = new Chart(ctx, config);
    }
}

function getRandomColor(opacity = 1) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
