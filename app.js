let express = require('express')
let path = require('path')
let fs = require('fs')
// let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')

let cors = require('cors')
// let ipfilter = require('express-ipfilter').IpFilter

const app = express()
let config = require('./config')

let log = require('./routes/log')

app.set('config', config)

app.use(cors())
app.use(bodyParser.json({
  limit: config.bodyLimit
}))

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'jade')

// router
app.use('/v1/log', log)

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

app.locals.maxLogId = 0
try {
  app.locals.maxLogId = parseInt(fs.readFileSync('./maxLogId.txt', 'utf-8'))
} catch (e) {
  console.log(e)
}
console.log('app.locals.maxLogId: ' + app.locals.maxLogId)
module.exports = app
