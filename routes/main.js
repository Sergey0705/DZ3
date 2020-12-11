const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const bodyParser = require(`body-parser`)
const config = require('../config/config.json')
const { products, skills } = require('../models/data.json')

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false})

router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', jsonParser, urlencodedParser, (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  if (!req.body.name || !req.body.email || !req.body.message) {
    console.log(req.body.text)
    return res.json({ msgemail: 'Все поля нужно заполнить!', status: 'Error' })
  }
  const transporter = nodemailer.createTransport(config.mail.smtp)
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.json({ msgemail: `При отправке письма произошла ошибка!: ${error}`, status: 'Error' })
    }
    res.json({ msgemail: 'Письмо успешно отправлено!', status: 'Ok' })
  })
  res.send('Реализовать функционал отправки письма')
})

module.exports = router
