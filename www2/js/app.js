angular.module('Rishwat', ['uiGmapgoogle-maps', 'Rishwat.controllers', 'Rishwat.services', 'Rishwat.directives'])

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
        key: 'AIzaSyDBfZ9vnEaCCBRg0Q2qYjKH5QDzysVhHps',
        v: '3.16',
        libraries: 'places'
    });
}])

.run(['$templateCache', function ($templateCache) {
    console.log('angular is ready');
    $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
    $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
}])
