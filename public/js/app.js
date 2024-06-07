// import
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = -33.4379202401447;
const lng = -70.65038985314246;

const map = L.map('map').setView([lat, lng], 13);

let markers = new L.FeatureGroup().addTo(map);
let marker;

// Utilizar el provider y GeoCoder
const geocodeService = L.esri.Geocoding.geocodeService();

document.addEventListener('DOMContentLoaded', () => {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const search = document.querySelector('#formSearch');
    search.addEventListener('input', searchAddress);
});

function searchAddress(e) {
    if (e.target.value.length > 8) {
        markers.clearLayers();

        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then((resultSearch) => {
            geocodeService
                .reverse()
                .latlng(resultSearch[0].bounds[0], 15)
                .run(function (error, result) {
                    fillInputs(result);

                    map.setView(resultSearch[0].bounds[0], 15);

                    // add marker
                    marker = new L.marker(resultSearch[0].bounds[0], {
                        draggable: true,
                        autoPan: true,
                    })
                        .addTo(map)
                        .bindPopup(resultSearch[0].label)
                        .openPopup();

                    markers.addLayer(marker);

                    // Detect marker move
                    marker.on('moveend', function (e) {
                        marker = e.target;
                        const position = marker.getLatLng();
                        map.panTo(new L.LatLng(position.lat, position.lng));

                        geocodeService
                            .reverse()
                            .latlng(position, 15)
                            .run(function (error, result) {
                                fillInputs(result);

                                marker.bindPopup(result.address.LongLabel);
                            });
                    });
                });
        });
    }
}
function fillInputs(result) {
    document.querySelector('#address').value = result.address.Address || '';
    document.querySelector('#city').value = result.address.City || '';
    document.querySelector('#state').value = result.address.Region || '';
    document.querySelector('#country').value = result.address.CountryCode || '';
    document.querySelector('#lat').value = result.latlng.lat || '';
    document.querySelector('#lng').value = result.latlng.lng || '';
}
// // setup
// const provider = new OpenStreetMapProvider();

// // search
// const results = await provider.search({ query: input.value });
9;
