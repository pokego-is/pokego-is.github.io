"use-strict";
/**
 * pokego-is-map.js
 **/
var DEBUG = false;

var GOOGLE = null;
var MAP = null;
var GYMS = null;
var POKESTOPS = null;

var ICELAND_MID = {lat: 64.996752, lng: -18.682185};
var DEFAULT_ZOOM = 7;

var mapOptions = {
    center: ICELAND_MID,
    disableDefaultUI: false,
    zoom: DEFAULT_ZOOM
};

GoogleMapsLoader.KEY = "AIzaSyCKo9xJWr8x45QuQSidhqKnrPCwMu06EXo";
GoogleMapsLoader.LIBRARIES = ["geometry", "places"];
GoogleMapsLoader.LANGUAGE = "en";
GoogleMapsLoader.REGION = "IS";

/**
 * Fetch Gyms data
 **/
var promiseLoadGyms = fetch("/data/gyms.json").then(
    function(response) {
        return response.json();
    }
).then(
    function(data) {
        GYMS = data;
        if (DEBUG) {
            console.log(data);
        }
    }
).catch(
    function(err) {
        console.error("Failed to load gyms.")
    }
);

var promiseLoadPokestops = fetch("/data/pokestops.json").then(
    function(response) {
        return response.json();
    }
).then(
    function(data) {
        POKESTOPS = data;
        if (DEBUG) {
            console.log(data);
        }
    }
).catch(
    function(err) {
        console.error("Failed to load pokestops.")
    }
);

function loadGoogleMap() {
    return new Promise(function (fulfill, reject) {
        GoogleMapsLoader.load(function(google) {
            try {
                GOOGLE = google;
                MAP = new GOOGLE.maps.Map(mapElement, mapOptions);
                fulfill("Loaded Google Map successfully!");
            }
            catch (err) {
                console.warn(err);
                reject(err);
            }
        });
    });
}
var promiseLoadGoogleMap = loadGoogleMap();

Promise.all([
    promiseLoadGyms,
    promiseLoadPokestops,
    promiseLoadGoogleMap
]).then(function() {
    for (var pokestop_id in POKESTOPS) {
        POKESTOPS[pokestop_id]["pointer"] = new GOOGLE.maps.Marker({
            position: {
                lat: POKESTOPS[pokestop_id]["lat"],
                lng: POKESTOPS[pokestop_id]["lon"]
            },
            map: MAP,
            title: "Gym",
            icon: "/images/pokestop-marker-20.png"
        });
        POKESTOPS[pokestop_id]['pointer'].setVisible(true);
    }
    for (var gym_id in GYMS) {
        GYMS[gym_id]["pointer"] = new GOOGLE.maps.Marker({
            position: {
                lat: GYMS[gym_id]["lat"],
                lng: GYMS[gym_id]["lon"]
            },
            map: MAP,
            title: "Gym",
            icon: "/images/gym-marker-25.png"
        });
        GYMS[gym_id]['pointer'].setVisible(true);
    }
});
