angular.module('Rishwat', ['ionic', 'Rishwat.controllers', 'Rishwat.services', 'Rishwat.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        StatusBar.styleDefault();
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "tabs.html"
    })

    // Each tab has its own nav history stack:
    .state('tab.report', {
        url: '/report',
        views: {
            'tab-report': {
                templateUrl: 'tab-report.html',
                controller: 'ReportCtrl'
            }
        }
    })

    .state('tab.visualize', {
        url: '/visualize',
        views: {
            'tab-visualize': {
                templateUrl: 'tab-visualize.html',
                controller: 'VisualizeCtrl'
            }
        }
    })

    .state('tab.games', {
        url: '/games',
        views: {
            'tab-games': {
                templateUrl: 'tab-games.html',
                controller: 'GamesCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/report');

});
