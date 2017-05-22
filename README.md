| [中文](https://github.com/UnPourTous/tianyan-server/blob/master/README.zh-CN.md) | [English](https://github.com/UnPourTous/tianyan-server/blob/master/README.md) |

# TianYan-Server 
## 0. Introduction 
Tianyan-Server is an open source log manager backend which can be private deployed.

## 1. Setup Server
```
git clone https://github.com/UnPourTous/tianyan-server.git
cd tianyan-server 
yarn 

// babel-node will be used
// setup dev directly
npm run dev
// or use pm2 
pm2 start --interpreter babel-node ./bin/www
```

## 2. Log format
First, you should know the format of a single log. then put it in to the upload body.

### 2.1. Single log format

key | require/option | type | description 
--- | --- | --- | ---
ts | require | String | Timestamp in ms 
|msg|require|String|Log content, all log should be converted to string before upload|
|tags|option|Array|custom types defined for this log, we have some predefined tags ['ERROR', 'WARN', 'INFO']|

### 2.2. Assemble your upload body (In order to fit my log viewer)

A valid upload request should be like this

``` shell
curl -X POST \
  http://localhost:3000/v1/log \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 100cd87e-131b-c4d9-e17f-69b1740ded59' \
  -d '{
  "logList": [
  	{
  	  "ts": "1495063513667",
          "msg": "log content, json or object should be convert to string"
  	}, 
  	{
  	  "ts": "1495063513667",
          "msg": "log content, json or object should be convert to string"
  	}
  ]
}'
```
The corresponding response which contain the log id we need.

``` js
{
	id: '520'
}
```

Then you can use this log id to get your uploaded log at [http://youhostname:3000/#!/logviewer/520](http://youhostname:3000/#!/logviewer/520)

## 3. Security Tips

TODO 
