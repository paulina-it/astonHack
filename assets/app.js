const apiKey = '5ae2e3f221c38a28845f05b66216899ac4f130b1c11a84fe9822199a';
let placesFound = [];
let lat;
let lon;
const culturalBtn = document.getElementById('cultural-btn');
const casualBtn = document.getElementById('casual-btn');

culturalBtn.addEventListener('click', function () {
    document.getElementById('search-container').innerHTML = `<input id="city" type="text" placeholder="City">
    <select name="activity" id="activity">
        <option value="">Art</option>
        <option value="">Museum</option>
        <option value="">Architecture</option>
        <option value="">Religion</option>
    </select>
    <input type="number" name="" id="" placeholder="Max Price">
    <button id="search" onclick="printOptions()">Search</button>`;
});

casualBtn.addEventListener('click', function () {
    document.getElementById('search-container').innerHTML = `<input id="city" type="text" placeholder="City">
    <select name="activity" id="activity">
        <option value="foods">Food</option>
        <option value="pubs">Drink</option>
        <option value="">Cinema</option>
        <option value="">Bowling</option>
        <option value="">Golf</option>
        <option value="">Club</option>
    </select>
    <input type="number" name="" id="" placeholder="Max Price">
    <button id="search" onclick="printOptions()">Search</button>`
});

async function getCoordinates(place) {
    let url = "https://api.opentripmap.com/0.1/en/places/geoname?name=" + place + "&apikey=" + apiKey;
    lat = await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            // console.log(responseData);
            lat = responseData.lat;
            lon = responseData.lon;
            return lat;
        })
        .catch(error => console.log(error));
    // console.log(lat, lon);
    getPlaces(lat, lon);
}

function getPlaces(latitude, longtitude) {
    lon_min = Math.floor(longtitude);
    lon_max = Math.ceil(longtitude);
    lat_min = Math.floor(latitude);
    lat_max = Math.ceil(latitude);;
    let search = document.getElementById('activity').value;

    let url = "https://api.opentripmap.com/0.1/en/places/bbox?lon_min=" + lon_min + "&lon_max=" + lon_max + "&lat_min=" + lat_min + "&lat_max=" + lat_max + "&apikey=" + apiKey;
    fetch(url)
        .then(response => {
            return response.json(); //remember to RETURN
        })
        .then(responseData => {
            responseData.features.forEach(element => {
                kinds = element.properties.kinds.split(',');
                kinds.forEach(kind => {
                    if (kind === search) {
                        console.log(element.properties.name);
                        placesFound.push(element.properties.name);
                    }
                })
            });
        })
        .catch(error => console.log(error));
}

async function printOptions() {
    placesFound = [];
    document.getElementById('list-contatiner').innerHTML = '';
    let city = document.getElementById('city').value;
    document.getElementById('city').value = '';
    getCoordinates(city);
    setTimeout(() => {
        document.getElementById('list-contatiner').innerHTML = `<h2>10 places to go in ${capitalize(city)}</h2>`;
        for (let i = 0; i < 10; i++) {
            document.getElementById('list-contatiner').innerHTML +=
                `<div class="place">
                <h3>${placesFound[i]}</h3>
            </div>`;

        }
    }, 1000);


}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}