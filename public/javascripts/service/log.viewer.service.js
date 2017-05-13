'use strict'
angular.module('myApp.sub').factory('LogViewerService', ['$timeout', '$interval', '$http', '$q', '$cookieStore', '$cookies',
  function ($timeout, $interval, $http, $q, $cookieStore, $cookies) {
    return {
      requestLogById: function (logId) {
        return $q(function (resolve, reject) {
          $http.get('log/' + logId).then(function (response) {
            resolve(response.data)
          }, function (response) {
            reject(response.data)
          })
        })
      }
    }
  }
])
