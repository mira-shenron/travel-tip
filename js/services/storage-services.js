'use strict'

export const storageService = {
    saveInLocalStorage,
    getFromLocalStorage
}

function saveInLocalStorage(key, val) {
    var str = JSON.stringify(val);
    localStorage.setItem(key, str);
}

function getFromLocalStorage(key) {
    var str = localStorage.getItem(key)
    return JSON.parse(str)
}