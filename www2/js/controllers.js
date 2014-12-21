angular.module('Rishwat.controllers', [])

.controller('WindowCtrl', function ($scope) {
    $scope.place = {};
    $scope.showPlaceDetails = function(param) {
        $scope.place = param;
    }
})

.controller("MapCtrl", ['$scope', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi', function ($scope, $timeout, $log, $http, GoogleMapApi) {
    $log.doLog = true

    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(38.769020, 59.004100),
            new google.maps.LatLng(21.491343, 79.614451)
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
    });

    angular.extend($scope, {
        selected: {
            options: {
                visible:false
            },
            templateurl:'window.tpl.html',
            templateparameter: {}
        },
        map: {
            control: {},
            center: {
                latitude: 30.370445,
                longitude: 70.012400
            },
            zoom: 6,
            dragging: false,
            bounds: {
                // new google.maps.LatLng(38.769020, 59.004100),
                // new google.maps.LatLng(21.491343, 79.614451)
            },
            markers: [],
            idkey: 'place_id',
            events: {
                idle: function (map) {},
                dragend: function(map) {
                    //update the search box bounds after dragging the map
                    var bounds = map.getBounds();
                    var ne = bounds.getNorthEast();
                    var sw = bounds.getSouthWest();
                    $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                }
            }
        },
        searchbox: {
            template:'searchbox.tpl.html',
            options: {
                bounds: {}
            },
            parentdiv:'searchBoxParent',
            events: {
                places_changed: function (searchBox) {
                    places = searchBox.getPlaces()
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
}]);
