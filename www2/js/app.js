angular.module('Rishwat', ['ionic', 'Rishwat.controllers', 'Rishwat.services', 'Rishwat.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        console.log("ionic is ready");
    });
});
