const express = require('express')
const fs = require('fs')
const mkdirp = require('mkdirp')
const router = express.Router()
const path = require('path')

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
      return parseInt(item)
    })
    files = files.sort((x, y) => {return parseInt(x) - parseInt(y)}).slice(-1 * limit).reverse()
    res.json(files)
  })
})

router.post('/', function (req, res, next) {
  const config = req.app.get('config')
  const uploadFileDir = config.fileUploadPath

  let logFileId = '' + (req.app.locals.maxLogId + 1)
  let filePath = path.join(uploadFileDir, '' + logFileId)
  if (req && req.body) {
    mkdirp(uploadFileDir, function (err) {
      if (err) {
        res.status(500).json(err)
        console.error(err)
      }
    })

    req.body.meta = {
      uploadTs: new Date().getTime(),
      id: logFileId,
      uploadIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    }

    const bodyJson = JSON.stringify(req.body)
    fs.writeFile(filePath, bodyJson, function (err) {
      if (!err) {
        res.json({
          id: logFileId
        })

        req.app.locals.maxLogId += 1
        saveLogId2File(req.app.locals.maxLogId)
      } else {
        res.status(500).json(err)
      }
    })
  } else {
    res.end('requst without body is not allowed', 400)
  }
})

module.exports = router
