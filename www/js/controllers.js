angular.module('Rishwat.controllers', [])

.controller('ReportCtrl', function($scope) {
    $scope.display = "none";

    $scope.onClick = function() {
        var display = $scope.display;
        if (undefined === display || "none" === display) {
            $scope.display = "block";
            $scope.displayy = "none";
        } else {
            $scope.display = "none";
            $scope.displayy = "none";
        }
    };
})

.controller('VisualizeCtrl', function($scope, $ionicLoading) {
    $scope.mapCreated = function(map) {
        $scope.map = map;
    };

    $scope.centerOnMe = function () {
        console.log("Centering");
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log('Got pos', pos);
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.poof = function (el) {
        console.log('poof: ', el);
        var opacity = el.css('opacity');
        el.css('opacity', !opacity);
    };
})

.controller('GamesCtrl', function($scope) {
})
