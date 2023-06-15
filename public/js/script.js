/** @format */

// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
	console.log("diving-book JS imported successfully!");
});

const dropdown = document.getElementsByClassName("dropdown-togglerrr");

const logDive = document.querySelector(".log-dive-form");
const coordsInput = document.querySelector("#coords-input");
const coordsInput2 = document.querySelector(".coords-input");

let map;
let mapEvent;

_getPosition();

// logDive.addEventListener("submit", _newDive);

function _getPosition() {
	if (navigator.geolocation) navigator.geolocation.getCurrentPosition(_loadMap);
}

function _loadMap(position) {
	const { latitude } = position.coords;
	const { longitude } = position.coords;

	const coords = [latitude, longitude];

	map = L.map("map").setView([36.90376456363123, 25.977802314643156], 19);

	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
	L.Control.geocoder().addTo(map);

	///////////////////////
	///////
	/////					HANDLING CLICKS
	/////
	///////////////////////

	map.on("click", _showForm);
	// this._renderDiveMarkers();
}

function _newDive() {
	const { lat, lng } = this.mapEvent.latlng;
	L.marker([lat, lng])
		.addTo(this.map)
		.bindPopup(
			L.popup({
				maxWidth: 200,
				minWidth: 100,
				autoClose: false,
				closeOnClick: false,
				className: "popup",
			})
		)
		.setPopupContent("dive")
		.openPopup();
}

function _showForm(mapE) {
	mapEvent = mapE;
	logDive.classList.remove("hidden");

	coordsInput.value = mapEvent.latlng;
}

function _renderDiveMarkers() {
	L.marker([lat, lng])
		.addTo(map)
		.bindPopup(
			L.popup({
				maxWidth: 200,
				minWidth: 100,
				autoClose: false,
				closeOnClick: false,
				className: "popup",
			})
		)
		.setPopupContent("dive")
		.openPopup();
}

fetch("/diving-sites/api")
	.then((response) => response.json())
	.then((allDives) => {
		console.log(allDives);

		let newArray = [];
		let otherArray = [];
		allDives.forEach((e) => {
			const regex = /LatLng\(([^,]+), ([^)]+)\)/;
			const matches = e.coords.match(regex);
			const image = e.user.imgProfile;
			let coordinates;

			if (matches && matches.length === 3) {
				const latitude = parseFloat(matches[1]);
				const longitude = parseFloat(matches[2]);

				coordinates = [latitude, longitude];
				// console.log(coordinates);
			}

			const myIcon = L.icon({
				iconUrl: image,
				iconSize: [50, 50],
			});
			L.marker(coordinates, { icon: myIcon })
				.addTo(map)
				.bindPopup(
					L.popup({
						maxWidth: 200,
						minWidth: 100,
						autoClose: false,
						closeOnClick: false,
						className: "rounded-circle",
					})
				)
				.setPopupContent(
					`<a style='color:white; text-decoration:none' href="/diving-site-details/${e._id}/">${e.divingSite}</a>`
				)
				.openPopup();
		});
	});

///////////////////////////////////////////////////
////
////     Leaflet Map
////
///////////////////////////////////////////////////

//////////////////////////
/////
/////  display map
/////
//////////////////////////
