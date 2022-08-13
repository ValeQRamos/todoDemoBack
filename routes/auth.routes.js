const router = require("express").Router();

const { signupProcess, loginProcess, logoutProcess } = require('../controllers/auth.controller');

router.post("/signup" , signupProcess);

// login logout
router.post('login',loginProcess);

router.get('/logout', logoutProcess)
// .-
module.exports = router;
