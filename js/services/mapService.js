'use stict'

import { storageService } from './storage-services'

const LOCS_KEY = 'locsDB'

export const mapService = {
    getLocs: getLocs,
    addLocation,
    setLocs,
    getPlaceApi,
}
var locs;
// var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function setLocs() {
    locs = storageService.getFromLocalStorage(LOCS_KEY)
    if (!locs || locs.laength === 0) locs = [];
}

function addLocation(name, lat, lng) {
    const loc = createLocation(name, lat, lng);
    locs.push(loc);
    storageService.saveInLocalStorage(LOCS_KEY, locs);

}

function createLocation(name, lat, lng) {
    return {
        id: makeId(),
        name,
        lat,
        lng,
        weather: '',
        createdAt: new Date(),
        updatedAt: ''
    }
}

function getPlaceApi() {

}