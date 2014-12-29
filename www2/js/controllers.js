angular.module('Rishwat.controllers', [])

.controller("MapCtrl", ['$scope', '$http','uiGmapGoogleMapApi', function ($scope, $http, GoogleMapApi, $location) {
    //Prep map, bound to Pakistan borders
    GoogleMapApi.then(function(maps) {
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(38.820396, 58.916209),
            new google.maps.LatLng(21.675231, 79.658396)
        );
        $scope.map.bounds = {
            northeast: {
                latitude:$scope.defaultBounds.getNorthEast().lat(),
                longitude:$scope.defaultBounds.getNorthEast().lng()
            },
            southwest: {
                latitude:$scope.defaultBounds.getSouthWest().lat(),
                longitude:-$scope.defaultBounds.getSouthWest().lng()
            }
        };
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
        console.log('map is ready');
    });

    angular.extend($scope, {
        findMe: function() {
            if (navigator.geolocation) {
                console.log('fetching location...');
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.map.center = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    $scope.map.zoom = 15;
                    console.log('found location: ', $scope.map.center);
                    $scope.$apply();
                }, function (error) {
                    console.log('geolocation failed: ', err.message);
                });
            } else {
                console.log('geolocation unavailable');
            }
        },
        map: {
            bounds: {
            },
            center: {
                latitude: 30.370445,
                longitude: 70.012400
            },
            disableDefaultUI: true,
            options: {
                disableDefaultUI: true
            },
            zoom: 6
        },
        searchbox: {
            template:'searchbox.tpl.html',
            options: {
                bounds: {}
            },
            parentdiv:'searchBoxParent',
            events: {
                places_changed: function (searchBox) {
                    places = searchBox.getPlaces();
                    if (places.length == 0) {
                        return;
                    }
                    // For each place, get the icon, place name, and location.
                    newMarkers = [];
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0, place; place = places[i]; i++) {
                        // Create a marker for each place.
                        var marker = {
                            id:i,
                            place_id: place.place_id,
                            name: place.name,
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng(),
                            options: {
                                visible:false
                            },
                            templateurl:'window.tpl.html',
                            templateparameter: place
                        };
                        newMarkers.push(marker);

                        bounds.extend(place.geometry.location);
                    }

                    $scope.map.bounds = {
                        northeast: {
                            latitude: bounds.getNorthEast().lat(),
                            longitude: bounds.getNorthEast().lng()
                        },
                        southwest: {
                            latitude: bounds.getSouthWest().lat(),
                            longitude: bounds.getSouthWest().lng()
                        }
                    }
                } //places_changed
            } //events
        } //searchbox
    }); //angular.extend
}])

.controller('AddCtrl', function ($scope) {
    console.log('loaded AddCtrl');
})

.controller('ReportCtrl', function ($scope) {
    console.log('loaded ReportCtrl');
});
