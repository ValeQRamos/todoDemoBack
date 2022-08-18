const router = require('express').Router();
// importar el controlador
const {uploadProcess, deleteImage} = require('../controllers/upload.controller')
// vamos a importar mi helper
const uploadCloud = require('../helpers/cloudinary')

// middleware para verificar 
const {verifyToken}= require('../middleware')

// multiples
router.post('/uploads', verifyToken ,uploadCloud.array('images', 3), uploadProcess)
// una sola
router.post('/single',verifyToken ,uploadCloud.single(('images'), uploadProcess))

router.delete('/delete-image/:name', deleteImage)

module.exports = router;