'use strict'
angular.module('myApp.sub').factory('LogViewerService', ['$timeout', '$interval', '$http', '$q', '$cookieStore', '$cookies',
  function ($timeout, $interval, $http, $q, $cookieStore, $cookies) {
    return {
      requestLogById: function (logId) {
        return $q(function (resolve, reject) {
          $http.get('v1/log/' + logId).then(function (response) {
            resolve(response.data)
          }, function (error) {
            reject((error && error.data) ? error.data : 'unknown error')
          })
        })
      },
      requestRecentLogIdList: function (logId) {
        return $q(function (resolve, reject) {
          $http.get('v1/log').then(function (response) {
            console.log(response)
            resolve(response.data)
          }, function (error) {
            console.log(error)
            reject(error)
          })
        })
      }
    }
  }
])
