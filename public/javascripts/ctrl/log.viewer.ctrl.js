'use strict'

angular.module('myApp.sub').config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/logviewer', {
      templateUrl: './view/log.viewer.html',
      controller: 'LogViewerCtrl'
    })
  }]).controller('LogViewerCtrl', ['$scope', '$timeout', '$interval', '$mdToast', '$mdDialog', '$q', '$routeParams', '$http',
  function ($scope, $timeout, $interval, $mdToast, $mdDialog, $q, $routeParams, $http) {
    var func = $scope.func = {}
    var data = $scope.data = {}
    this._mdPanel = $mdPanel

    func.onSetKeyword = function () {
      var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center()

      var config = {
        attachTo: angular.element(document.body),
        controller: PanelDialogCtrl,
        controllerAs: 'ctrl',
        disableParentScroll: this.disableParentScroll,
        templateUrl: 'panel.tmpl.html',
        hasBackdrop: true,
        panelClass: 'demo-dialog-example',
        position: position,
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      }

      this._mdPanel.open(config)
    }
    func.onClickSearch = function () {
      data.showLoading = true
      var url = 'https://sit-hjdata.webank.com/cgi-bin/applogdownload?logid=' + data.logId
      $http.get(url).then(function (result) {
        data.showLoading = false
        console.log(result)
        data.logList = beautifyLog(result.data.logList)
      }, function (error) {
        data.showLoading = false
        console.log(error)
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .textContent('查询出错,' + JSON.stringify(error))
            .ok('关闭')
        )
      })
    }

    function beautifyLog (rawRetData) {
      var logList
      rawRetData.forEach(function (item) {
        if (item) {
          logList.push({
            datetime: item.time,
            body: angular.isString(item.data) ? item.data : JSON.stringify(item.data),
            type: getLogType(item.data)
          })
        }
      })
      return logList
    }

    var errorKeywordList = ['失败']

    function getLogType (logBody) {
      if (logBody) {
        for (var i in errorKeywordList) {
          var keyword = errorKeywordList[i]
          if (logBody.indexOf(keyword) != -1) {
            console.log('error')
            return 'error'
          }
        }
      }
      return ''
    }
  }
])
