angular.module('Rishwat', ['ngRoute', 'uiGmapgoogle-maps', 'Rishwat.controllers', 'Rishwat.services', 'Rishwat.directives'])

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
        key: 'AIzaSyDBfZ9vnEaCCBRg0Q2qYjKH5QDzysVhHps',
        v: '3.16',
        libraries: 'places'
    });
}])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when(
        '/map', {
            templateUrl: 'partials/map.html',
            controller: 'MapCtrl'
        }
    ).when(
        '/add', {
            templateUrl: 'partials/add.html',
            controller: 'AddCtrl'
        }
    ).when(
        '/report/:reportId', {
            templateUrl: 'partials/report.html',
            controller: 'ReportCtrl'
        }
    ).otherwise({
        redirectTo: '/map'
    });
}])

.run(['$templateCache', function ($templateCache) {
    console.log('angular is ready');
    $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
}])
