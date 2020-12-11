const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./models/data.json')

const db = low(adapter)

const getSkills = () => db.getState().skills
const getProducts = () => db.getState().products
const saveSkills = ({ number }) =>
  db
    .get('skills')
    .push({
      number,
    })
    .write()
const saveProducts = ({ src, name, price }) =>
db
  .get('products')
  .push({
    src,
    name,
    price
  })
  .write()

module.exports = {
  getSkills,
  getProducts,
  saveSkills,
  saveProducts,
}