// submit form
// const {cloudName, uploadPreset} = require('../../src/config/env.js')

$(function () {
    $('#observationForm').on('submit', async () => {
        this.preventDefault()
        
        $('#submitBtn').text('Uploading...')
        $('#submitBtn').prop('attribute', true)
    
    })
})


// Map input
const map = L.map('map').setView([38.5283, -98.5795], 4)

let marker


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map)

function setLocation(lat, lng) {
    $('#latitude').val(lat)
    $('#longitude').val(lng)

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map)
        marker.on('dragend', () => {
        const pos = marker.getLatLng()
        setLocation(pos.lat, pos.lng)
        });
    }
}

// place marker
map.on('click', (e) => {
    setLocation(e.latlng.lat, e.latlng.lng)
});