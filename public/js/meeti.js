document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#location')) {
        showMap();
    }
});

function showMap() {
    //Get Lat, Lng
    const lat = document.querySelector('#lat').value,
        lng = document.querySelector('#lng').value,
        add = document.querySelector('#address').value;

    const map = L.map('location').setView([lat, lng], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup(add).openPopup();
}
