const express = require('express')
const fs = require('fs')
const mkdirp = require('mkdirp')
const router = express.Router()
const path = require('path')
const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter()

function saveLogId2File (maxLogId) {
  fs.writeFile('./maxLogId.txt', '' + maxLogId, 'utf8', (err) => {
    if (err) throw err
  })
}

router.get('/:id', function (req, res, next) {
  let logId = req.params.id
  const config = req.app.get('config')
  const uploadFileDir = config.fileUploadPath

  let logFilePath = path.join(uploadFileDir, '' + logId)
  try {
    fs.readFile(logFilePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.status(404).json({
            error: 'logId ' + logId + ' does not exist'
          })
        } else {
          throw err
        }
      } else {
        res.json(JSON.parse(data.toString()))
      }
    })
  } catch (e) {
    console.warn(e)
  }
})

router.get('/', function (req, res, next) {
  const config = req.app.get('config')
  const limit = req.query.limit || 10
  const uploadFileDir = config.fileUploadPath
  fs.readdir(uploadFileDir, function (err, files) {
    if (err) {
      res.status(404).json(JSON.stringify(err))
      return
    }
    files = files.map(item => {
      let info = req.app.locals.logInfoMap[item]
      return {
        id: item,
        env: info.env,
        ecif: info.ecif,
        nickname: info.nickname,
        uploadTs: info.uploadTs
      }
    })
    files = files.sort((x, y) => { return parseInt(x.id) - parseInt(y.id) }).slice(-1 * limit).reverse()

    res.json({
      maxLogId: req.app.locals.maxLogId,
      uploadTs: req.app.locals.uploadTs,
      logList: files
    })
  })
})

router.post('/', function (req, res, next) {
  const config = req.app.get('config')
  const uploadFileDir = config.fileUploadPath
  const timestamp = new Date().getTime()

  // 组合一个file name = id+环境+ecif
  let logFileId = req.app.locals.maxLogId + 1
  let filePath = path.join(uploadFileDir, '' + logFileId)
  console.log('----->>', req.body)
  if (req && req.body && req.body.logList) {
    mkdirp(uploadFileDir, function (err) {
      if (err) {
        res.status(500).json(err)
        console.error(err)
      }
    })

    req.body.meta = {
      uploadTs: timestamp,
      id: logFileId,
      uploadIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    }
    const bodyJson = JSON.stringify(req.body)
    fs.writeFile(filePath, bodyJson, function (err) {
      if (!err) {
        res.json({
          id: logFileId
        })

        // 更新数据
        req.app.locals.maxLogId += 1
        req.app.locals.uploadTs = timestamp
        res.app.locals.logInfoMap = {
          ...res.app.locals.logInfoMap,
          [logFileId]: {
            env: req.body.env || 'unknown',
            ecif: req.body.ecif || 'unlogin',
            nickname: req.body.nickname || 'unknown',
            uploadTs: timestamp
          }
        }
        let logTxt = {
          maxLogId: req.app.locals.maxLogId,
          uploadTs: req.app.locals.uploadTs,
          logInfoMap: res.app.locals.logInfoMap
        }
        saveLogId2File(JSON.stringify(logTxt))
        // 通知
        myEmitter.emit('handleRequest', {
          maxLogId: req.app.locals.maxLogId,
          env: req.body.env || 'unknown',
          ecif: req.body.ecif || 'unlogin',
          nickname: req.body.nickname || 'unknown',
          uploadTs: timestamp
        })
      } else {
        res.status(500).json(err)
      }
    })
  } else {
    res.end('requst without body is not allowed', 400)
  }
})

module.exports = {
  router,
  myEmitter
}
