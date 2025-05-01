const router = require("express").Router();
const parser = require("../Utils/cloudinary"); 
const { userLogin, userRegistration } = require("../Controllers/authController");

router.post('/register', parser.single("image"), userRegistration);
router.post('/login', userLogin);

module.exports = router;
