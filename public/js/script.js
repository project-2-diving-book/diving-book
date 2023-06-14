/** @format */

// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
	console.log("diving-book JS imported successfully!");
});

const dropdown = document.getElementsByClassName("dropdown-togglerrr");

///////////////////////////////////////////////////
////
////     Leaflet Map
////
///////////////////////////////////////////////////
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function (position) {
			const { latitude } = position.coords;
			const { longitude } = position.coords;
			console.log(latitude, longitude);

			const coords = [latitude, longitude];

			const map = L.map("map").setView(
				[36.90376456363123, 25.977802314643156],
				19
			);

			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map);

			map.on("click", function (mapEvent) {
				console.log(mapEvent, "mapEvent");
				const { lat, lng } = mapEvent.latlng;

				L.marker([lat, lng]).addTo(map).bindPopup("Dive").openPopup();
			});
		},
		function () {
			alert("could not get your position");
		}
	);
}
