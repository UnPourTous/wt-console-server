'use strict';
angular.module('myApp.sub').factory('ServerLogService', ['$timeout', '$interval', '$http', '$q', '$cookieStore', '$cookies',
    function ($timeout, $interval, $http, $q, $cookieStore, $cookies) {
        return {
            requestLog: function (dcnNo, startDatetime, endDatetime, keyword, limit) {
                var option = {
                  path: '/',
                  secure: true,
                  domain: 'sit-personal.webank.com'
                };

                return $q(function (resolve, reject) {
                  $cookies.remove('dcnNo');
                  $cookies.remove('webankToken');
                  $cookies.remove('userId');

                  $cookies.put('dcnNo', dcnNo, option);
                  $cookies.put('webankToken', 'testToken', option);
                  $cookies.put('userId', 'testUserId', option);

                  $http.post('https://sit-personal.webank.com/k/hj/hello/log_detail', {
                    key: keyword,
                    max_size: limit
                  }).then(function (response) {
                    // response = {data: {
                    //   "process_type": "sync",
                    //   "ret_code": "20270000",
                    //   "ret_data": [
                    //     "wbk.log.2016-08-15.log:DEBUG|2016-08-15 00:29:00218|pool-3-thread-1|cn.webank.rmb.core.impl.SynGuaranteedPublisher:55|Publish sync message [bizSeqNo:1608150K002027iBiHiqe5iZHkxzARwE,uniqueId:r/0f7faae5-3a46-4dba-8bb0-8ceb2184f695,sendTimestamp:2016-08-15 00:29:00.218,receiveTimestamp:null] to KA0/s/09300024/02/0",
                    //   ],
                    //   "ret_msg": "请求成功",
                    //   "token_status": "OK"
                    // }};
                    if (!response || ['20350000', '20270000'].indexOf(response.data.ret_code) == -1) {
                      // failed
                      reject(response.data.ret_msg);
                    } else {
                      resolve(response.data.ret_data);
                    }
                  }, function (response) {
                    // response = {data: {
                    //   "process_type": "sync",
                    //   "ret_code": "20270000",
                    //   "ret_data": [
                    //     "wbk.log.2016-08-15.log:DEBUG|2016-08-15 00:29:00218|pool-3-thread-1|cn.webank.rmb.core.impl.SynGuaranteedPublisher:55|Publish sync message [bizSeqNo:1608150K002027iBiHiqe5iZHkxzARwE,uniqueId:r/0f7faae5-3a46-4dba-8bb0-8ceb2184f695,sendTimestamp:2016-08-15 00:29:00.218,receiveTimestamp:null] to KA0/s/09300024/02/0",
                    //   ],
                    //   "ret_msg": "请求成功",
                    //   "token_status": "OK"
                    // }};
                    // if (!response || ['20350000', '20270000'].indexOf(response.data.ret_code) == -1) {
                    //   // failed
                    //   reject(response.data.ret_msg);
                    // } else {
                    //   resolve(response.data.ret_data);
                    // }
                    reject(response);
                  });
                });
            },
            beautifyLog: function (rawRetData) {
                var logList = [];
                rawRetData.forEach(function (item) {
                    if (item) {
                        var splitResult = item.split('|');
                        var datetime = splitResult.length > 1 ? splitResult[1] : 'N/A';
                        logList.push({
                            datetime: datetime,
                            body: item,
                        });
                    }
                });
                return logList;
            }
        };
    }
]);
