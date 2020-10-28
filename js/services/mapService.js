export const mapService = {
    getLocs: getLocs,
}
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
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