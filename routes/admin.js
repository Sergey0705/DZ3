const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
const bodyParser = require(`body-parser`)
const db = require('../models/db')
const path = require('path')

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false})

router.get('/admin', jsonParser, urlencodedParser, (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  // res.render('pages/admin', { title: 'Admin page' })
  const [age, concerts, cities, years] = db.getSkills() || []
  req.body.age = age
  req.body.concerts = concerts
  req.body.cities = cities
  req.body.years = years

  if (req.session.isAdmin) {
    return res.render('pages/admin', { title: 'Admin page' }, {
    })
  }
})

router.post('/skills', (req, res, next) => {
  const form = new formidable.IncomingForm()

  form.parse(req, function (err, fields) {
    if (err) {
      return next(err)
    }
  
    for (const number in fields.name) {
      if (!number) {
        return res.redirect('/admin?msgskill=Не указазаны параметры скиллов')
      }
      if (number < 0 || !isFinite(number) || parseInt(number) !== number) {
        return res.redirect('/admin?msgskill=Параметры скилов должны быть целым положительным числом')
      }
      db.saveSkills( {number} )
    }
    res.redirect('/admin?msgskill=Параметры скиллов указаны')
  })
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
  res.send('Реализовать сохранение нового объекта со значениями блока скиллов')
})

router.post('/upload', (req, res, next) => {
  const form = new formidable.IncomingForm()
  const upload = path.join('./public', 'assets', 'img', 'products')
  let fileName

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err)
    }
    if (files.photo.name === '' || files.photo.size === 0) {
      fs.unlink(files.photo.path)
      return res.redirect('/admin?msgfile=Не загружена картинка!')
    }
    if (!fields.name) {
      fs.unlink(files.photo.path)
      return res.redirect('/admin?msgfile=Не указано описание картинки!')
    }
    fileName = path.join(upload, files.photo.name)
    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err)
        fs.unlink(fileName)
        fs.rename(files.photo.path, fileName)
      }
      const dir = fileName.subustr(fileName.indexOf('/public'))
      const { name, price } = fields.name
      db.saveProducts( {dir, name, price} )
      
      res.redirect('/?msgfile=Картинка успешно загружена');
    })

  })
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
  res.send('Реализовать сохранения объекта товара на стороне сервера')
})

module.exports = router
