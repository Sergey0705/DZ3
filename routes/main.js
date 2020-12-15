const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail')
const db = require('../models/db')
const config = require('../config/config.json')
require('dotenv').config()

router.get('/', (req, res, next) => {
  const skills = db.getSkills() || []
  const products = db.getProducts() || []
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', async (req, res, next) => {
  try {
    console.log(process.env.SEND_GRID_API_KEY)
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
    const msg = {
      to: config.mail.smtp.auth.user,
      from: `"${req.body.name}" <${req.body.email}>`,
      subject: config.mail.subject,
      text: req.body.message.trim().slice(0, 500) +
          `\n Отправлено с: <${req.body.email}>`,
    }
    await sgMail.send(msg)
  } catch (err) {
      return res.json({
      msgemail: `При отправке письма произошла ошибка!: ${err}`,
      status: 'Error',
    })
  }
  res.json({ msgemail: 'Письмо успешно отправлено!', status: 'Ok' })
  // TODO: Реализовать функционал отправки письма.
  // if (!req.body.name || !req.body.email || !req.body.message) {
  //   console.log(req.body.text)
  //   return res.json({ msgemail: 'Все поля нужно заполнить!', status: 'Error' })
  // }
  // const transporter = nodemailer.createTransport(config.mail.smtp)
  // const mailOptions = {
  //   from: `"${req.body.name}" <${req.body.email}>`,
  //   to: config.mail.smtp.auth.user,
  //   subject: config.mail.subject,
  //   text:
  //     req.body.message.trim().slice(0, 500) +
  //     `\n Отправлено с: <${req.body.email}>`,
  // }
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     return res.json({
  //       msgemail: `При отправке письма произошла ошибка!: ${error}`,
  //       status: 'Error',
  //     })
  //   }
  //   res.json({ msgemail: 'Письмо успешно отправлено!', status: 'Ok' })
  // })
  // res.send('Реализовать функционал отправки письма')

})

module.exports = router
