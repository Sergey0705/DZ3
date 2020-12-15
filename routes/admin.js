const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
// const bodyParser = require(`body-parser`)
const db = require('../models/db')
const path = require('path')
const createError = require('http-errors')
// const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
const guard = (req, res, next) => {
  console.log(
    '🚀 ~ file: admin.js ~ line 13 ~ guard ~ req.session.isAdmin',
    req.session.isAdmin
  )
  if (req.session.isAdmin) {
    return next()
  }
  next(createError(403, `Forbidden`))
}

router.get('/', guard, (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  // res.render('pages/admin', { title: 'Admin page' })
  const skills = db.getSkills() || []
 
  const [
    { number: age },
    { number: concerts },
    { number: cities },
    { number: years },
  ] = skills
  const { msgfile } = req.query
  return res.render('pages/admin', {
    title: 'Admin page',
    age,
    concerts,
    cities,
    years,
    msgfile,
  })
})

router.post('/skills', guard, (req, res, next) => {
  const { age, concerts, cities, years } = req.body
  const skills = [
    {
      number: age,
      text: 'Возраст начала занятий на скрипке',
    },
    {
      number: concerts,
      text: 'Концертов отыграл',
    },
    {
      number: cities,
      text: 'Максимальное число городов в туре',
    },
    {
      number: years,
      text: 'Лет на сцене в качестве скрипача',
    },
  ]
  db.saveSkills(skills)
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */
  res.redirect('/admin')
})

router.post('/upload', guard, (req, res, next) => {
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
      }
      const dir = fileName.replace('public', '')
     
      const { name, price } = fields
      db.saveProducts({ dir, name, price })

      res.redirect('/')
    })
  })
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */
})

module.exports = router
