const Router = require('express')
const router = new Router()
const diviceController = require('../controllers/deviceController')

router.post('/', diviceController.create)
router.get('/', diviceController.getAll)
router.get('/:id', diviceController.getOne)

module.exports = router