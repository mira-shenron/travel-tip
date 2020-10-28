import { mapService } from './services/mapService.js'

var gMap;
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
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
            panTo(res.coords.latitude, res.coords.longitude);
        });
    })
}


export function initMap(lat = 32.0749831, lng = 34.9120554) {
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
                    
                    // addPlace(name, myLatlng); ??should add this place to locations table
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