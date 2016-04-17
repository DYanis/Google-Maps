$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();   
  geocoder = new google.maps.Geocoder();
  var manuallyLocation = false;
  var lastMarker = null;
  var autocomplete;

  function initialize() {
    var myLatLng = {
      lat: 42.69774219548408,
      lng: 23.322043418884277
    };

    var mapProp = {
      center: myLatLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('address'), {
        types: ['geocode']
      }
    );

    google.maps.event.addListener(map, 'click', function(event) {
      if (manuallyLocation) {
        if (lastMarker !== null) {
          lastMarker.setMap(null);
        }

        geocodeLatLng(map, event.latLng);
        lastMarker = placeMarker(event.latLng);
      }
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);

  $('#form').submit(function() {
    controler.handler();
    return false;
  });

  $('#manuallyLocation').click(function() {
    initialize();
    manuallyLocation = true;
  });
});

function placeMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  return marker;
}

function codeAddress() {
  var address = $('#address').val();
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function geocodeLatLng(map, latlng) {
  geocoder.geocode({
    'location': latlng
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $('#address').val(results[0].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

var model = {
  setData: function (data) {
    if (typeof(Storage) !== "undefined") {
      localStorage.name = data.name;
      localStorage.address = data.address;
      localStorage.email = data.email;
      localStorage.phone = data.phone;
      localStorage.website = data.website;
    } else {
      alert("Sorry! No Web Storage support.");
    }
  },

  getData: function () {
    var data = {
      name: localStorage.name,
      address: localStorage.address,
      email: localStorage.email,
      phone: localStorage.phone,
      website: localStorage.website
    };

    return data;
  }
};

var view = {
  clearFields: function () {
    $('#name').val(null);
    $('#address').val(null);
    $('#email').val(null);
    $('#phone').val(null);
    $('#website').val(null);
  }
};

var controler = {
  handler: function () {
    var data = {
      name: $('#name').val(),
      address: $('#address').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      website: $('#website').val()
    };

    model.setData(data);
    codeAddress();
    view.clearFields();
  }
};
