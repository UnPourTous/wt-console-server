'use strict'

angular.module('myApp.sub').config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/logviewer/:logId?', {
    templateUrl: './view/log.viewer.html',
    controller: 'LogViewerCtrl'
  })
}]).controller('LogViewerCtrl', ['$scope', '$timeout', '$interval', '$mdToast', '$mdDialog', '$q', '$routeParams', '$http', 'LogViewerService', '$location',
  function ($scope, $timeout, $interval, $mdToast, $mdDialog, $q, $routeParams, $http, LogViewerService, $location) {
    let func = $scope.func = {}
    let data = $scope.data = {}

    data.logId = $routeParams.logId || ''
    if (data.logId) {
      queryLog(data.logId)

      LogViewerService.requestRecentLogIdList().then(response => {
        data.recentLogIdList = response
      }, error => {
        console.log(error)
      })
    }

    // this._mdPanel = $mdPanel

    // func.onSetKeyword = function () {
    //   let position = this._mdPanel.newPanelPosition()
    //     .absolute()
    //     .center()
    //
    //   let config = {
    //     attachTo: angular.element(document.body),
    //     controller: PanelDialogCtrl,
    //     controllerAs: 'ctrl',
    //     disableParentScroll: this.disableParentScroll,
    //     templateUrl: 'panel.tmpl.html',
    //     hasBackdrop: true,
    //     panelClass: 'demo-dialog-example',
    //     position: position,
    //     trapFocus: true,
    //     zIndex: 150,
    //     clickOutsideToClose: true,
    //     escapeToClose: true,
    //     focusOnOpen: true
    //   }
    //
    //   this._mdPanel.open(config)
    // }

    func.onClickSearch = function () {
      const targetPath = '/logviewer/' + data.logId
      if (targetPath === $location.path()) {
        queryLog(data.logId)
      } else {
        $location.path('/logviewer/' + data.logId)
      }
    }

    function queryLog (logId) {
      data.showLoading = true
      LogViewerService.requestLogById(logId).then(function (result) {
        data.showLoading = false
        console.log(result.logList)
        data.logList = beautifyLog(result.logList)
        data.meta = result.meta
      }, function (error) {
        data.showLoading = false
        console.log(error)
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .textContent(error ? error.error : 'unexpected error, retry please')
            .ok('Close')
        )
      })
    }

    function beautifyLog (rawRetData) {
      let logList
      rawRetData.forEach(function (item) {
        if (item) {
          logList = logList || []
          logList.push({
            datetime: item.ts,
            body: angular.isString(item.msg) ? item.msg : JSON.stringify(item.msg),
            type: getLogType(item.msg)
          })
        }
      })
      return logList
    }

    let errorKeywordList = ['失败']

    function getLogType (logBody) {
      if (logBody) {
        for (let i in errorKeywordList) {
          let keyword = errorKeywordList[i]
          if (logBody.indexOf(keyword) !== -1) {
            console.log('error')
            return 'error'
          }
        }
      }
      return ''
    }
  }
])
