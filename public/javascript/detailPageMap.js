mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: campground.geometry.coordinates,
    zoom: 4, // starting zoom
    style: 'mapbox://styles/mapbox/streets-v11', // style URL or style object
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset:25 })
        .setHTML(
            `<h5>${campground.name}</h5><p>${campground.location}</p>`
            )
    )
    .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());