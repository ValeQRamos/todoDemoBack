const cloudinary = require('cloudinary').v2
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')

// setup cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: 'todo-demo-clase',
      allowedFormats:["png", "jpg", "jpeg", "svg", "webp", "pdf"],
      fileFilter:(req, file, cb) => {
        if(!file.originalname.match(/\.(svg | gif | doc)$/)){
          return cb(new Error('Archivo no valido'))
        }
        cb(null, file.originalname)
      },
      public_id: `app-${file.originalname}`
    }
  }
})

const uploadCloud = multer({storage})

module.exports = uploadCloud