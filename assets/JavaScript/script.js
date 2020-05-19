// Object for neighborhoods
var neighborhoods = [
  {
    title: "Barclay Downs",
    coords: { lat: 35.161352, lng: -80.838031 },
  },
  {
    title: "South End",
    coords: { lat: 35.2125569, lng: -80.8588 },
  },
  {
    title: "North Davidson",
    coords: { lat: 35.2482123, lng: -80.8018 },
  },
  {
    title: "Plaza Midwood",
    coords: { lat: 35.2239, lng: -80.8018 },
  },
  {
    title: "Dilworth",
    coords: { lat: 35.2058895, lng: -80.8516 },
  },
  {
    title: "Cotswold",
    coords: { lat: 35.1849, lng: -80.7907 },
  },
  {
    title: "Oakhurst",
    coords: { lat: 35.1914, lng: -80.7771 },
  },
  {
    title: "Myers Park",
    coords: { lat: 35.1797, lng: -80.8262 },
  },
  {
    title: "Montford",
    coords: { lat: 35.1744, lng: -80.8502 },
  },
  {
    title: "Eastover",
    coords: { lat: 35.1924, lng: -80.8184 },
  },
  {
    title: "Elizabeth",
    coords: { lat: 35.2142, lng: -80.8184 },
  },
  {
    title: "Chantilly",
    coords: { lat: 35.2115244, lng: -80.8087 },
  },
  {
    title: "First Ward",
    coords: { lat: 35.2264, lng: -80.835 },
  },
  {
    title: "Fourth Ward",
    coords: { lat: 35.231, lng: -80.8419 },
  },
  {
    title: "Greenville",
    coords: { lat: 35.2419, lng: -80.8422 },
  },
];

//passes selected neighborhood to results.html
function passValue() {
  var selectNeighborhood = document.getElementById("neighborhoods").value;
  localStorage.setItem("neighborhood", selectNeighborhood);
  return true;
}

// check url
var urlArray = ["outdoor-areas", "restaurants", "popular", "events"];
//takes a word, checks if its true returns true or false
function checkIfParamIsTrue(word) {
  var queryString = window.location.search;
  //console.log(queryString);
  var urlParams = new URLSearchParams(queryString);
  //console.log(urlParams);
  var keyword = urlParams.get(word);
  return keyword === "true";
}

//=============Submit button========================

function submitButton() {
  var urlParams = "?";

  for (i = 0; i < urlArray.length; i++) {
    var checkBox = document.querySelector("#" + urlArray[i]);
    console.log(checkBox)
    if (checkBox.checked == true) {
      //adding string that got the id
      urlParams += urlArray[i] + "=true&";
    }
  }
  console.log(urlParams);
  //combining route of file with params--building URL 
  window.location = "./assets/results.html" + urlParams;
  console.log(location.href);
}

var submitBtn = document.getElementById("submit-btn");
if (submitBtn) {
  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    submitButton();
    passValue()
  });
}

//selects card container on results page and determines which check box was selected and should be displayed.
var cardContainer = document.getElementById("card-container");
if (cardContainer) {
  //loops through url array
  for (i = 0; i < urlArray.length; i++) {
    var param = urlArray[i];
    var paramIsTrue = checkIfParamIsTrue(param);
    if (paramIsTrue) {
    } else {
      //getElbyclassname grabs items from an array
      var cardWithClass = document.getElementsByClassName(param);
      //displays whichever options were selected
      cardWithClass[0].style.display = "none";
    }

    console.log(param, paramIsTrue);
  }
}
//================Map=====================
// to hold the map
var map;
//function for map
function initMap() {
  // Disable default street stuff
  var myStyles =[
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
              { visibility: "off" }
        ]
    }
];
  
  //new map
  map = new google.maps.Map(document.getElementById("map"), {
    //map options
    center: { lat: 35.2271, lng: -80.8431 },
    zoom: 12,
    disableDefaultUI: true,
    styles: myStyles
  });
  // Get selected neighborhoods from storage
  var neighborhood = localStorage.getItem("neighborhood");
  console.log(neighborhood);
  var neighborhoodCoords;
  // Iterate through the object
  for (var i = 0; i < neighborhoods.length; i++) {
    // If an objects title is equal to selected neighborhood
    if (neighborhood === neighborhoods[i].title) {
      // Assign the coordinates to a variable
      neighborhoodCoords = neighborhoods[i].coords;
      console.log(neighborhoodCoords);
    }
  }

  neighborhoodMarker(neighborhoodCoords);

  function neighborhoodMarker() {
    // add marker
    var marker = new google.maps.Marker({
      position: neighborhoodCoords,
      map: map,
      animation: google.maps.Animation.DROP,
    });

    // zoom and pan to marker
    map.panTo(neighborhoodCoords);
    map.setZoom(15);
  }
}

var outdoorMarkers = []
var popularMarkers = []
var restaurantMarkers = []

// Check if restaurant box is checked
function restaurantCheck(){ 
  var restaurantCheck = document.getElementById("restaurants").checked
  if(restaurantCheck == true) {
    getRestaurants()
  } else if (restaurantCheck == false) {
    clearOutdoorMarkers()
  }
}
// Get restaurant data from API
function getRestaurants() {
  // Get selected neighborhoods from storage
  var neighborhood = localStorage.getItem("neighborhood"); 
  // Iterate through object
  for (var i = 0; i < neighborhoods.length; i++) {
    // If an objects title is equal to selected neighborhood
    if (neighborhood === neighborhoods[i].title) {
      // Assign the coordinates to a variable
      var neighborhoodCoords = neighborhoods[i].coords;
    }
  }
  // Get places service
  var service = new google.maps.places.PlacesService(map)
  // Query for nearby places
  var request = {
    location: new google.maps.LatLng(neighborhoodCoords.lat, neighborhoodCoords.lng),
    radius: "1500",
    type: ["restaurant"],
  }
  service.nearbySearch(request, handleResults)

  function handleResults(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for(var i=1; i < 10; i++) {
        console.log(results[i])
        addMarker(results[i])
      }
   }
  }
  
  function addMarker(results) {
    var marker = new google.maps.Marker({
      position: results.geometry.location,
      map: map,
      animation: google.maps.Animation.DROP,
    })
    restaurantMarkers.push(marker)
  }
  
}

// Check if popular is checked
function popularCheck() {
  var popularCheck = document.getElementById("popular").checked
  if(popularCheck == true) {
    getPopular()
  }
}

// Get popular places data 
function getPopular() {
  // Get selected neighborhoods from storage
  var neighborhood = localStorage.getItem("neighborhood"); 
  // Iterate through object
  for (var i = 0; i < neighborhoods.length; i++) {
    // If an objects title is equal to selected neighborhood
    if (neighborhood === neighborhoods[i].title) {
      // Assign the coordinates to a variable
      var neighborhoodCoords = neighborhoods[i].coords;
    }
  }
  // Get places service
  var service = new google.maps.places.PlacesService(map)
  // Query for nearby places
  var request = {
    location: new google.maps.LatLng(neighborhoodCoords.lat, neighborhoodCoords.lng),
    radius: "1500",
    type: ["aquarium", "art-gallery", "shopping-mall", "tourist-attraction", "movie-theater", "stadium", "night-club"],
  }
  service.nearbySearch(request, handleResults)

  function handleResults(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for(var i=1; i < 10; i++) {
        console.log(results[i])
        addMarker(results[i])
      }
   }
  }
  
  function addMarker(results) {
    var marker = new google.maps.Marker({
      position: results.geometry.location,
      map: map,
      animation: google.maps.Animation.DROP,
    })
    popularMarkers.push(marker)
  }
}

// Check if outdoors is checked
function outdoorCheck() {
  var outdoorCheck = document.getElementById("outdoor-areas").checked
  if(outdoorCheck == true) {
    getOutdoor()
  } 
}

// Get outdoor areas data
function getOutdoor() {
  // Get selected neighborhoods from storage
  var neighborhood = localStorage.getItem("neighborhood"); 
  // Iterate through object
  for (var i = 0; i < neighborhoods.length; i++) {
    // If an objects title is equal to selected neighborhood
    if (neighborhood === neighborhoods[i].title) {
      // Assign the coordinates to a variable
      var neighborhoodCoords = neighborhoods[i].coords;
    }
  }
  // Get places service
  var service = new google.maps.places.PlacesService(map)
  // Query for nearby places
  var request = {
    location: new google.maps.LatLng(neighborhoodCoords.lat, neighborhoodCoords.lng),
    radius: "1500",
    type: ["park"],
  }
  service.nearbySearch(request, handleResults)
  
  function handleResults(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for(var i=1; i < 10; i++) {
        console.log(results[i])
        addMarker(results[i])
      }
   }
  }
  
  function addMarker(results) {
    var marker = new google.maps.Marker({
      position: results.geometry.location,
      map: map,
      animation: google.maps.Animation.DROP,
    })
    outdoorMarkers.push(marker)
  }
}

// function clearOutdoorMarkers(){
//   setMapOnAll(null)
//   clearOutdoorMarkers = []
// }

//==========Events/Ticketmaster API===============
var ticketMasterKey = "inHlvBLTGUTbsQyVFJkNPakSwfAWIMCa";
var ticketMasterURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + ticketMasterKey;


$.ajax({
  url: ticketMasterURL,
  method: "GET"
}).then(function(response) {
  console.log(response);

var eventsCard = $("#card-section-one");
var itemOne = $("#event-item-one").text(response._embedded.events[0]);
var itemTwo = $("#event-item-two").text(response._embedded.events[1]);
var itemThree = $("#event-item-three").text(response._embedded.events[2]);
var itemFour = $("#event-item-four").text(response._embedded.events[3]);

//eventsCard.text(JSON.stringify(itemOne, itemTwo, itemThree, itemFour));

});
