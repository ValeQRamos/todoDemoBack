const router = require("express").Router();
//importar el controlador 
const {getLoggedUser,editProfile} = require("../controllers/user.controller")
//vamos a importar los middleware 
const { verifyToken } = require("../middleware")

//Read - perfil
router.get("/my-profile",verifyToken,getLoggedUser);
//UPDate - Perfil
router.patch("/edit-profile",verifyToken,editProfile);
//Delete - user
//router.delete("/delete-user");

//Read - otro usuario
//router.get("/:id/profile")


module.exports = router;
