'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.sub',
    //'myApp.pub',
    "ng",
    "ngAnimate",
    "ngAria",
    'ngMaterial',
    'ngCookies'
    //'mdDataTable'
]).config(['$locationProvider', '$routeProvider', '$httpProvider',
function ($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');
    // default to sub
    $routeProvider.otherwise({redirectTo: '/logviewer'});
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

angular.module('myApp.sub', ['ngRoute', 'ngMaterial', 'ngSanitize']);