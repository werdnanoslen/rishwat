angular.module('controllers')

.controller('AddCtrl', function($scope, $rootScope, $ionicLoading, $log,
        $state, $timeout, $ionicHistory, $ionicActionSheet, uiGmapGoogleMapApi,
        uiGmapIsReady, API) {
    $scope.noGoingBack = (null === $ionicHistory.backView()) ? true : false;
    var geocoder = new google.maps.Geocoder();
    // hacked because gmap's events don't include infowindow clicks
    $scope.Gmap;
    $scope.actualMapObj;
    $scope.isDragging = false;
    $scope.form = {};
    $scope.keyboardSpace = "";
    $scope.photoPreview = false;
    $scope.mapReady = false;
    $scope.map = {
        center: {
            latitude: 0,
            longitude: 0
        },
        control: {},
        events: {
            idle: function(map) {
                $scope.isDragging = false;
                $scope.updateBounds(map);
            },
            dragstart: function() {
                $scope.isDragging = true;
            },
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    $scope.actualMapObj = map;
                });
            },
            zoom_changed: function(map) {
                $scope.updateBounds(map);
            }
        },
        markers: {
            options: {
                icon: {
                    url: 'img/location.png',
                    scaledSize: new google.maps.Size(50, 50), // scaled size
                }
            }
        },
        options: {
            disableDefaultUI: true,
            clickableIcons: false
        },
        zoom: 15
    };
    $scope.whatSelect = {
        options: [
            {
                name: 'Driving License',
                value: 'Driving License'
            },
            {
                name: 'Other',
                value: 'Other'
            }
        ],
        selection: undefined
    };

    var autocomplete = new google.maps.places.Autocomplete(document.querySelector('#search'));
    autocomplete.addListener('place_changed', function() {
        $scope.blurWhere();
        $scope.loading = $ionicLoading.show({
            content: 'Getting location...',
            showBackdrop: false
        });
        var place = autocomplete.getPlace();
        $scope.form.place = place.formatted_address;
        $scope.search.lat = place.geometry.location.lat();
        $scope.search.lng = place.geometry.location.lng();
        $scope.centerMap();
        $ionicLoading.hide();
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.noGoingBack = (null === $ionicHistory.backView()) ? true : false;
        $scope.form = {};
        $scope.removePhoto();
        if (undefined !== $rootScope.search.place) {
            $scope.form.place = $rootScope.search.place;
        }
    });

    uiGmapGoogleMapApi.then(function(uiMap) {
        $scope.mapReady = true;
        $scope.centerMap();
    });

    $scope.centerMap = function() {
        console.log('Centering');
        if (undefined === $scope.search || Object.keys($scope.search).length === 0) {
            $scope.centerOnMe();
        } else {
            $scope.map.center.latitude = $scope.search.lat;
            $scope.map.center.longitude = $scope.search.lng;
        }
    };

    $scope.centerOnMe = function() {
        console.log('Getting current location');
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.setCenter(pos.coords.latitude, pos.coords.longitude);
            $ionicLoading.hide();
        }, function(error) {
            $log.error('Unable to get location from device: ', error.message);
            var promise = API.ipGeolocate();
            promise.then(
                function (payload) {
                    var latlng = payload.data.loc.split(',');
                    $scope.setCenter(latlng[0], latlng[1]);
                    $ionicLoading.hide();
                },
                function (errorPayload) {
                    $log.error('Unable to get location by IP: ', errorPayload);
                    $ionicLoading.hide();
                    $log.log('Using default lat & lng: ' + $scope.defaultLat + ', ' + $scope.defaultLng);
                    $scope.setCenter($scope.defaultLat, $scope.defaultLng);
                }
            );
        });
    };

    $scope.setCenter = function(lat, lng) {
        console.log('got location', {lat, lng});
        $scope.search.lat = lat;
        $scope.search.lng = lng;
        $scope.map.position = {
            id: 'position',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1.0,
                fillColor: '#4D90FE',
                strokeColor: '#ffffff',
                strokeWeight: 2.0,
                scale: 7
            },
            coords: {
                latitude: $scope.search.lat,
                longitude:$scope.search.lng
            }
        };
        $scope.centerMap();
    };

    $scope.blurWhere = function(event) {
        $scope.keyboardSpace = "";
    };

    $scope.focusWhere = function(event) {
        var rect = event.target.getBoundingClientRect();
        $scope.keyboardSpace = 50-1*rect.top+"px";
    };


    $scope.previewPhoto = function() {
        $ionicActionSheet.show({
            buttons: [{
                text: 'Camera'
            }, {
                text: 'Gallery'
            }],
            titleText: 'Upload image from',
            cancelText: 'Cancel',
            buttonClicked: function(index, button) {
                if ("Camera" === button.text) {
                    useCamera();
                } else if ("Gallery" === button.text) {
                    useGallery();
                }
                return true;
            }
        });

        function useCamera() {
            navigator.camera.getPicture(function(imageData) {
                var canvas = document.getElementById('photoPreview');
                var ctx = canvas.getContext('2d');
                var img = new Image();
                img.src = 'data:image/jpeg;base64,' + imageData;
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                }
                $scope.form.photo = img.src;
                $scope.$apply(function () {
                    $scope.photoPreview = true;
                });
            }, function(err) {
                console.error('camera error: ', err);
            }, {
                destinationType: Camera.DestinationType.DATA_URL,
                quality: 25
            });
        }

        function useGallery() {
            var input = document.getElementById('fileInput');
            input.click();
            input.onchange = function() {
                var file = input.files[0];
                var canvas = document.getElementById('photoPreview');
                var ctx = canvas.getContext('2d');
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image();
                    img.src = event.target.result;
                    img.onload = function() {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                    }
                    $scope.form.photo = img.src;
                    $scope.$apply(function () {
                        $scope.photoPreview = true;
                    });
                }
                reader.readAsDataURL(file);
            }
        }
    }

    $scope.removePhoto = function() {
        $scope.form.photo = undefined;
        $scope.photoPreview = false;
    }

    $scope.submitForm = function() {
        //TODO validation
        $scope.loading = $ionicLoading.show({
            template: 'Submitting...'
        });
        var reportJson = $scope.form;
        reportJson.active = true;
        reportJson.lat = $scope.search.lat;
        reportJson.lng = $scope.search.lng;
        if ($scope.whatSelect.selection != 'Other') {
            reportJson.what = $scope.whatSelect.selection;
        } else {
            $scope.form.what = undefined;
            reportJson.what = $scope.form.what;
        }
        var promise = API.addReport(reportJson);
        promise.then(
            function (payload) {
                $scope.removePhoto();
                $scope.loading = $ionicLoading.show({
                    template: 'Submitted!',
                    duration: 1000
                });
                $state.go('report', {reportId: payload.data.report.insertId});
            },
            function (errorPayload) {
                $scope.loading = $ionicLoading.show({
                    template: 'Failed to submit',
                    duration: 1000
                });
                $log.error('failure posting report', errorPayload);
            }
        );
    };

    $scope.updateBounds = function(map) {
        $scope.Gmap = map;
        $scope.search.lat = map.center.lat();
        $scope.search.lng = map.center.lng();
        var latlng = new google.maps.LatLng($scope.search.lat, $scope.search.lng);
        $scope.map.search = {
            id: 'search',
            coords: {
                latitude: latlng.lat(),
                longitude: latlng.lng()
            }
        };
        geocoder.geocode({'location': latlng}, function(results, status) {
            var topResult = results[0];
            if (google.maps.GeocoderStatus.OK === status) {
                if ('ROOFTOP' === topResult.geometry.location_type) {
                    $scope.form.place = topResult.formatted_address;
                } else {
                    console.log('No exact address for this location: ', latlng);
                    var nearbyReq = {
                        location: latlng,
                        // radius: 1,
                        // type: 'store',
                        // when types array is deprecated, replace rankBy and types with commented lines https://developers.google.com/maps/documentation/javascript/places#deprecation
                        rankBy: google.maps.places.RankBy.DISTANCE,
                        types: ['store', 'bus_station', 'park', 'bank', 'parking', 'pharmacy', 'doctor', 'school', 'police', 'fire_station', 'restaurant', 'lodging', 'hospital']
                    };
                    function nearbyCallback(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                            // if (nearbyReq.radius > 10000) { // if over 10km away...
                                $scope.form.place = latlng.toUrlValue();
                            // } else {
                            //     nearbyReq.radius *= 10;
                            //     console.log('Looking for landmarks within ' + nearbyReq.radius + ' meters...');
                            //     placesService.nearbySearch(nearbyReq, nearbyCallback);
                            // }
                        } else if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var place = results[0].name;
                            var placelatlng = results[0].geometry.location;
                            var distance = google.maps.geometry.spherical.computeDistanceBetween(placelatlng, latlng);
                            if (distance > 100) {
                                distance = (distance/1000).toFixed(1) + 'km';
                            } else {
                                distance = Math.round(distance) + 'm';
                            }
                            var heading = google.maps.geometry.spherical.computeHeading(placelatlng, latlng);
                            var q = 90/4;
                            if (q <= heading & heading < 3*q) {
                                heading = 'northeast';
                            } else if (3*q <= heading & heading < 5*q) {
                                heading = 'east';
                            } else if (5*q <= heading & heading < 7*q) {
                                heading = 'southeast';
                            } else if (-1*q >= heading & heading > -3*q) {
                                heading = 'northwest';
                            } else if (-3*q >= heading & heading > -5*q) {
                                heading = 'west';
                            } else if (-5*q >= heading & heading > -7*q) {
                                heading = 'southwest';
                            } else if (-7*q >= heading || heading >= 7*q) {
                                heading = 'south';
                            } else {
                                heading = 'north';
                            }
                            var place = distance + ' ' + heading + ' of ' + place;
                            $scope.$apply(function () {
                                $scope.form.place = place;
                            });
                        }
                    };
                    var placesService = new google.maps.places.PlacesService($scope.actualMapObj);
                    placesService.nearbySearch(nearbyReq, nearbyCallback);
                }
            } else {
                console.error('geocode error: ', status);
                $scope.form.place = latlng.toUrlValue();
            }
            $scope.map.center.latitude = latlng.lat();
            $scope.map.center.longitude = latlng.lng();
            $scope.search.lat = latlng.lat();
            $scope.search.lng = latlng.lng();
            //TODO: handle scope updates to async model better than this
            $scope.$apply();
        });
    }
})
