'use stict'

import { storageService } from './storage-services.js'
import { utils } from './utils-service.js'
// import axios from '../../lib/axioss.js'

const LOCS_KEY = 'locsDB'
var currLoc;

export const mapService = {
    getLocs: getLocs,
    addLocation,
    setLocs,
    getPlaceDataByName,
    getCurrLoc,
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

function getCurrLoc() {
    return currLoc;
}

function setCurrLoc(id) {
    currLoc = locs.find(function(loc) {
        return (loc.id === id)
    })
}

function addLocation(name, lat, lng) {
    const loc = createLocation(name, lat, lng);
    locs.push(loc);
    setCurrLoc(loc.id);
    storageService.saveInLocalStorage(LOCS_KEY, locs);
}

function createLocation(name, lat, lng) {
    return {
        id: utils.makeId(),
        name,
        lat,
        lng,
        weather: '',
        createdAt: new Date(),
        updatedAt: ''
    }
}

// function getPlaceApi(place) {
//     return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyBCHE8wlLLHaFn9_WPzvZ7R0yrLsZDDRvA`, true)
//         .then(res => res.json());
// }
function getPlaceDataByName(place) {
    return axios(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyBCHE8wlLLHaFn9_WPzvZ7R0yrLsZDDRvA`)
        .then(res => ({
            name: place,
            lat: res.data.results[0].geometry.location.lat,
            lng: res.data.results[0].geometry.location.lng
        }));
}