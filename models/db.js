const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./models/data.json')

const db = low(adapter)

const getSkills = () => db.getState().skills
const getProducts = () => db.getState().products
const saveSkills = (skills) => db.set('skills', skills).write()
const saveProducts = ({ dir, name, price }) =>
  db
    .get('products')
    .push({
      src: dir,
      name,
      price,
    })
    .write()

module.exports = {
  getSkills,
  getProducts,
  saveSkills,
  saveProducts,
}
