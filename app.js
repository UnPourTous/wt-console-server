let express = require('express')
let path = require('path')
let fs = require('fs')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let mime = require('mime')
const request = require('request')

let cors = require('cors')
// let ipfilter = require('express-ipfilter').IpFilter

const app = express()
let config = require('./config')

let {router, myEmitter} = require('./routes/log')

app.set('config', config)

app.use(cors())
app.use(bodyParser.json({
  limit: config.bodyLimit
}))

app.use(favicon(path.join(__dirname, 'dist/dist', 'favicon.png')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'dist/dist')))

app.set('view engine', 'jade')

// router
app.use('/v1/log', router)
app.use('/download/:id', function (req, res, next) {
  let logId = req.params.id
  const config = req.app.get('config')
  const uploadFileDir = config.fileUploadPath
  const file = uploadFileDir + logId

  const filename = path.basename(file)
  const mimetype = mime.lookup(file)

  res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.txt')
  res.setHeader('Content-type', mimetype)

  var filestream = fs.createReadStream(file)
  filestream.pipe(res)
})
app.use(/^\/$|\/detail\/./, function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/dist', 'index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500).json({error: err})
})

try {
  let readContent = JSON.parse(fs.readFileSync('./maxLogId.txt', 'utf-8'))
  app.locals.maxLogId = parseInt(readContent.maxLogId || 0)
  app.locals.uploadTs = parseInt(readContent.uploadTs || 0)
  app.locals.logInfoMap = readContent.logInfoMap || {}
} catch (e) {
  console.log(e)
}
console.log('app.locals.maxLogId: ' + app.locals.maxLogId)
console.log('app.locals.uploadTs: ' + app.locals.uploadTs)
console.log('app.locals.logInfoMap: ' + app.locals.logInfoMap)

// 注册通知
myEmitter.on('handleRequest', (e) => {
  let {
    maxLogId = '',
    env = '',
    ecif = '',
    nickname = '',
    uploadTs = ''
  } = e
  console.log(e)
  request({
    url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1c92a751-8706-44e4-b25d-ad8f52432bd8',
    json: true,
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: {
      'msgtype': 'markdown',
      'markdown': {
        'content': `收到最新日志上报: \n ` +
          `>id:<font color="warning">${maxLogId}</font> \n ` +
          `>环境:<font color="warning">${env}</font> \n ` +
          `>ecif:<font color="warning">${ecif}</font> \n ` +
          `>昵称:<font color="warning">${nickname}</font> \n \n ` +
          `[点击查看详情 >>](http://10.39.98.13:3000/detail/${maxLogId})`
      }
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  })
})
module.exports = app
