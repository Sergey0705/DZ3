const express = require('express')
const router = express.Router()
const login = require('../models/login.json')

router.get('/', (req, res, next) => {
  console.log('LOGIN')
  if (req.session.isAdmin) {
    return res.redirect('/admin')
  }
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  const { email, password } = req.body
  if (email === login.email && password === login.password) {
    req.session.isAdmin = true
    return res.redirect('/admin')
  }
  return res.redirect('/login?msglogin=неверный логин или пароль')
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  // res.send('Реализовать функцию входа по email и паролю')
})

module.exports = router
