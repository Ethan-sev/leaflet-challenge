
const earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch the earthquake data
fetch(earthquakeDataUrl)
    .then(response => response.json())
    .then(data => {
        visualizeData(data);
    })
    .catch(error => console.log(error));

// create map
const map = L.map('map').setView([20, 0], 2);
// MARKERS

// Add a tile 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to visualize the data
function visualizeData(data) {
    // Function to determine marker size based on magnitude
    function getMarkerSize(magnitude) {
        return magnitude * 4;
    }

    // Function to determine marker color based on depth
    function getMarkerColor(depth) {
        return depth > 90 ? '#ff5f65' :
               depth > 70 ? '#fca35d' :
               depth > 50 ? '#fdb72a' :
               depth > 30 ? '#f7db11' :
               depth > 10 ? '#dcf400' :
                            '#a3f600';
    }

    // Iterate over the earthquake features
    data.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coords[2];

        // Create a circle marker, 
        const marker = L.circleMarker([coords[1], coords[0]], {
            radius: getMarkerSize(magnitude),
            fillColor: getMarkerColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add a popup to the marker, not for hover but for clicking
        marker.bindPopup(`
            <h3>${feature.properties.place}</h3>
            <p>Magnitude: ${magnitude}</p>
            <p>Depth: ${depth} km</p>
            <p>${new Date(feature.properties.time)}</p>
        `);

        // Add the marker to the map
        marker.addTo(map);
    });
}
// Add legend
// so many syntax errors to get it in the bottom right
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [-10, 10, 30, 50, 70, 90];
    const colors = [
        '#a3f600',
        '#dcf400',
        '#f7db11',
        '#fdb72a',
        '#fca35d',
        '#ff5f65'
    ];

    // Loop through 
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);