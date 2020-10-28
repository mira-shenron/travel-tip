import { mapService } from './services/mapService.js'

var gMap;
var gLatReceived;
var gLngReceived;

console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs))
mapService.setLocs()

window.onload = () => {
    const parameters = new URLSearchParams(window.location.search);
    const [latParam, lngParam] = prepareParams(parameters.get('lat'),parameters.get('lng'));

    initMap(latParam,lngParam)
        .then(() => {

            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })

    document.querySelector('.btn-my-location').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        getPosition().then(res => {
            mapService.addLocation('myLocation', res.coords.latitude, res.coords.longitude);
            panTo(res.coords.latitude, res.coords.longitude);
        });
    })

    document.querySelector('.copy-loc').addEventListener('click', (ev) => {
        var loc = mapService.getCurrLoc();

        //real link
        // document.querySelector("#copy-link").innerText = `https://mira-shenron.github.io/travel-tip/index.html?lat=${loc.lat}&lng=${loc.lng}`;

        //for debugging
        document.querySelector("#copy-link").innerText = `http://127.0.0.1:5501/index.html?lat=${loc.lat}&lng=${loc.lng}`;
        
        document.querySelector("#copy-link").select();
        document.execCommand("copy");
    })
}

document.querySelector('.btn-search').addEventListener('click', (ev) => {
    ev.preventDefault();
    const place = document.querySelector('input[name="location-search"]').value;
    if (place === '') return;
    mapService.getPlaceApi(place)
        .then(({ name, lat, lng }) => {
            mapService.addLocation(name, lat, lng)
            panTo(lat, lng)
        });
})


export function initMap(lat, lng) {
    console.log('InitMap');

    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener('click', function (event) {
                var myLatlng = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }

                mapService.addLocation('myLocation', event.latLng.lat(), event.latLng.lng());
                gMap.setCenter(myLatlng);
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBCHE8wlLLHaFn9_WPzvZ7R0yrLsZDDRvA`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function prepareParams(latReceived,lngReceived){
    //some default location if not received 
    var lat = 32.0749831;
    var lng = 34.9120554;

    if (latReceived && lngReceived) {
        lat = parseFloat(latReceived);
        lng = parseFloat(lngReceived)
    }
    return [parseFloat(lat), parseFloat(lng)];
}