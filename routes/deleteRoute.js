const express = require('express')
const router = express.Router()
const deleteController = require('../controllers/deleteController')

router.delete('/',deleteController.deleteUser)

module.exports = router;
