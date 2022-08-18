const router = require("express").Router();
//importar el controlador
const {
  getLoggedUser,
  editProfile,
  getUserById,
  onlyAdminRead,
  deleteAccount,
} = require("../controllers/user.controller");
//vamos a importar los middleware
const { verifyToken, checkRole } = require("../middleware");

//Read - perfil
router.get("/my-profile", verifyToken, getLoggedUser);

//UPDate - Perfil
router.patch("/edit-profile", verifyToken, editProfile);

//Delete - user
router.delete("/delete-user", verifyToken, deleteAccount);

//Read - otro usuario
router.get("/:id/profile", verifyToken, getUserById);

// Read all user!!! (debe de ir en admin staff)
router.get("/admin/users", verifyToken, checkRole(['Admin']), onlyAdminRead );

module.exports = router;
