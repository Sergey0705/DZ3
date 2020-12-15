const express = require('express')
const router = express.Router()
const main = require('./main')
const login = require('./login.js')

router.use('/', main)

router.use('/login', login)

router.use('/admin', require('./admin'))

module.exports = router
